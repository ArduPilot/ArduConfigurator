/*global chrome */
////'use strict';

TABS.calibration = {};

TABS.calibration.model =  0;

TABS.calibration.initialize = function (callback) {

    //var loadChainer = new MSPChainerClass();
    var saveChainer = new MSPChainerClass();//,
        //modalStart,
        //modalStop,
        //modalProcessing;

    if (GUI.active_tab != 'calibration') {
        GUI.active_tab = 'calibration';
        //googleAnalytics.sendAppView('Calibration');
    }
    // loadChainer.setChain([
    //     mspHelper.loadStatus,
    //     mspHelper.loadSensorConfig,
    //     mspHelper.loadCalibrationData
    // ]);
    // loadChainer.setExitPoint(loadHtml);
    // loadChainer.execute();
    loadHtml();

    saveChainer.setChain([
        mspHelper.saveCalibrationData,
        mspHelper.saveToEeprom
    ]);
    saveChainer.setExitPoint(reboot);

    function reboot() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('configurationEepromSaved'));

        FC.longyREQ = 0;

        GUI.tab_switch_cleanup(function() {
        //    MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);
        });
        preflight_reboot(); // mav
    }

    function reinitialize() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('deviceRebooting'));
        GUI.handleReconnect($('.tab_calibration a'));
    }

    function loadHtml() {
        GUI.load("./tabs/calibration.html", processHtml);
    }

    // 
    function updateCalibrationSteps() {
        for (var i = 0; i < 6; i++) {
            var $element = $('[data-step="' + (i + 1) + '"]');

            if (CALIBRATION_DATA.acc['Pos' + i] === 0) {
                $element.removeClass('finished').removeClass('active');
            } else {
                $element.addClass("finished").removeClass('active');
            }
        }
    }

    function updateSensorData() {
        var pos = ['X', 'Y', 'Z'];
        pos.forEach(function (item) {
            $('[name=accGain' + item + ']').val(CALIBRATION_DATA.accGain[item]);
            $('[name=accZero' + item + ']').val(CALIBRATION_DATA.accZero[item]);
            $('[name=Mag' + item + ']').val(CALIBRATION_DATA.magZero[item]);
            $('[name=MagGain' + item + ']').val(CALIBRATION_DATA.magGain[item]);
        });
        $('[name=OpflowScale]').val(CALIBRATION_DATA.opflow.Scale);
        updateCalibrationSteps();
    }

    function checkFinishAccCalibrate() {
        updateSensorData();
    }

    // see also periodicStatusUpdater.js for 'Calibrate Accelerometer' button responses

    // triggered when the 'Calibrate Accelerometer' button is  pressed. zz
    function calibrateNew() {

        $('#calibrate-start-button').css('pointer-events', 'none').css('opacity', '0.4'); // make 'Calibrate Access' non-interactive, briefly

       // var newStep = null;
        var $button = $(this);

        if (TABS.calibration.model === 0) {
            // reset all 6 values to zero.
            for (var i = 0; i < 6; i++) {
                if (CALIBRATION_DATA.acc['Pos' + i] != 0) {
                    CALIBRATION_DATA.acc['Pos' + i] = 0;
                }
            }
            updateCalibrationSteps();
    
        }


        // error state, start over
        if (FC.longyREQ > 255 ) { FC.longyREQ = 99999;  } // success

        // at FIRST step, we send a COMMAND_LONG , CMD=241 ,ie MAV_CMD_PREFLIGHT_CALIBRATION and 'param5 = 1'
        if ((TABS.calibration.model == 0)  && (FC.longyREQ == 0) ) { 

            preflight_accel_cal(SYSID,COMPID );
            GUI.log(chrome.i18n.getMessage('initialSetupAccelCalibStarted'));
            
        }

        if ((TABS.calibration.model == 0)  && (FC.longyREQ == 1) ) { 
            CALIBRATION_DATA.acc['Pos0'] = 1;
            TABS.calibration.model = 1;
            preflight_accel_cal_progress(SYSID,COMPID,TABS.calibration.model);

            GUI.log(chrome.i18n.getMessage('initialSetupAccelCalibProgress'));

        } else 
        if (TABS.calibration.model >= 1 ) { 

            preflight_accel_cal_progress(SYSID,COMPID,TABS.calibration.model);
            CALIBRATION_DATA.acc['Pos' + TABS.calibration.model] = 1;
            TABS.calibration.model +=1;
            GUI.log(chrome.i18n.getMessage('initialSetupAccelCalibProgress'));

        }

        // 
        if (TABS.calibration.model > 6) {
            TABS.calibration.model =0; 
        }
 

        updateCalibrationSteps();
        $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again


    }

    function processHtml() {

        // show/hide areas
        //$('#mag_btn, #mag-calibrated-data').css('pointer-events', 'none').css('opacity', '0.4'); // make 'calibratecompass 3d' non-interactive
        $('#mag_btn2').css('pointer-events', 'none').css('opacity', '0.4'); // make 'accept' non-interactive
        $('#mag_btn3').css('pointer-events', 'none').css('opacity', '0.4'); // make 'cancel' non-interactive
        $('#gyro_cal').css('pointer-events', 'none').css('opacity', '0.4'); // make div with canvas non-interactive
        $('#opflow_btn, #opflow-calibrated-data').css('pointer-events', 'none').css('opacity', '0.4');

        // respond to button press/s
        $('#level_btn').on('click', function () {
            //CALIBRATION_DATA.opflow.Scale = parseFloat($('[name=OpflowScale]').val());
            //saveChainer.execute();
            //preflight_reboot(); // mav
            level_accel_cal();
            updateSensorData();

        });
        // respond to button press/s
        $('#level_btn2').on('click', function () {
            //CALIBRATION_DATA.opflow.Scale = parseFloat($('[name=OpflowScale]').val());
            //saveChainer.execute();
            //preflight_reboot(); // mav
            large_veh_mag_cal(); // assumes yawwed to north if not given by GUI
            updateSensorData();
            // change color of the thing that was clicked.
            //var x = this;
            //$('#'+(this.id)).find('a').css('color', 'red').css('border', 'red').css('background-color', 'yellow').css('a:hover', 'purple'); // test
            $('#level_btn2').find('a').css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#FDBE02');//.css('a:hover', 'purple'); // test
            //                                                   blue                   blue                              yellow/mango
        });
        // respond to 'calibrate compas 3d' button press/s
        $('#calibrateButtonSave').on('click', function () {
            $('#calibrateButtonSave').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive
            CALIBRATION_DATA.opflow.Scale = parseFloat($('[name=OpflowScale]').val());
            //saveChainer.execute();
            //preflight_reboot(); // mav
            reboot(); //cleans up then calls above
        });

        // respond to 'accept' button press/s
        $('#mag_btn2').on('click', function () {  
            helper.interval.remove('compass_calibration_interval');
            $('#mag_btn2').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive
            $('#mag_btn3').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive
            $('#3d_cal_notes').html("3D Compass CAL ACCEPTED.")
            mag_cal_accept();
            updateSensorData();
        });
        // respond to 'cancel' button press/s
        $('#mag_btn3').on('click', function () {  
            helper.interval.remove('compass_calibration_interval');
            $('#mag_btn2').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive
            $('#mag_btn3').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive
            $('#3d_cal_notes').html("3D Compass CAL CANCELLED.")
            mag_cal_cancel();
            updateSensorData();
        });
        //  respond to button press/s  ( )
        $('#mag_btn').on('click', function () {

            //MSP.send_message(MSPCodes.MSP_MAG_CALIBRATION, false, false, function () {
                GUI.log(chrome.i18n.getMessage('initialSetupMagCalibStarted'));
            //});

            $('#3d_cal_notes').html("Press [Calibrate Compass 3D] then ...<br>Rotate your flight-controller around in 3D space until such time as all red bars get to the top and STAY there.<br></br>");

            if ( FC.curr_mav_state && FC.curr_mav_state['MAG_CAL_PROGRESS'] && FC.curr_mav_state['MAG_CAL_PROGRESS'].completed  ){
                FC.curr_mav_state['MAG_CAL_PROGRESS'].completed = 0;
            }
            mag_cal_start();
            // accept
            //$('#mag_btn2').css('pointer-events', 'auto').css('opacity', '1.0'); // make fully visible and interactive
            // cancel
            $('#mag_btn3').css('pointer-events', 'auto').css('opacity', '1.0'); // make fully visible and interactive
            // 3d cal-graph
            $('#gyrocal').css('pointer-events', 'auto').css('opacity', '1.0'); // make fully visible and interactive

            var button = $(this);

            $(button).addClass('disabled');


            //setInterval(function () {
            helper.interval.add('compass_calibration_interval', function () {

                var c = document.getElementById("gyrocal");  // 500x100pixels
                //let width = $("#gyrocal canvas").width(), height = $("#gyrocal canvas").height();

                if (c == undefined ) return;

                var ctx = c.getContext("2d");


                // wipe cancvas
                ctx.fillStyle = "#FFFF99";
                ctx.fillRect(0, 0, 500, 100);
                var raw = String.fromCharCode(0,0,0,0,0,0,0,0,0,0);
                if ( FC.curr_mav_state && FC.curr_mav_state['MAG_CAL_PROGRESS'] && FC.curr_mav_state['MAG_CAL_PROGRESS'].completion_mask  ){
                    raw = FC.curr_mav_state['MAG_CAL_PROGRESS'].completion_mask;

                    if (FC.curr_mav_state['MAG_CAL_PROGRESS'].completed == 1 ) {

                        // enable the 'accept' button when completed..
                        $('#mag_btn2').css('pointer-events', 'auto').css('opacity', '1.0'); // make fully visible and interactive

                        $('#3d_cal_notes').html("CAL COMPLETED SUCCESS !! Press [Accept] or [Cancel] to the right.")
                        helper.interval.remove('compass_calibration_interval');
                    }
                }
            

                // canvas notes:  upper-left is 0,0
                var points = [0,0,0,0,0,0,0,0,0,0]; // len 10
                points.forEach( (v,i) => {
                    var x  = raw[i];
                    points[i] = x.charCodeAt(0);
                 });

                // we have 10 data points, ranging from 0-254, draw them on canvas
                points.forEach( (v,i) => {
                    ctx.fillStyle = "#CC0000";
                    var sx = 10+i*40+10*i; // box is 500 wide and we have 10 of them
                    var sy = 100-v/2.4;  // box is 100 tall, and we go to 255
                    var width = 30; // vert bars are 30 wide
                    var height = v/2.4; // goes to bottom 100->255 scaling
                    ctx.fillRect(sx, sy, width, height);
                    
                 });


                //if ((map.width_ != width) || (map.height_ != height)) map.updateSize();
                //map.width_ = width; map.height_ = height;
            }, 200);

            // var countdown = 0;
            // helper.interval.add('compass_calibration_interval', function () {
            //     //countdown++;
            //     //if (countdown >= 300) { // at 100ms intervals, 30sec
            //         //setTimeout(function () {
            //             $(button).removeClass('disabled');

            //             //modalProcessing.close();
            //             GUI.log(chrome.i18n.getMessage('initialSetupMagCalibEnded'));
                        
            //             //MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, null);
            //             updateSensorData();
            //             helper.interval.remove('compass_calibration_interval');

            //             //Cleanup
            //            // delete modalProcessing;
            //            // $('.jBox-wrapper').remove();
            //        // }, 100);
            //     //} else {
            //         //modalProcessing.content.find('.modal-compass-countdown').text(countdown);
            //     //}

            // }, 1000);
        });

        // respond to button press/s
        $('#opflow_btn').on('click', function () {
            MSP.send_message(MSPCodes.MSP2_ARDUPILOT_OPFLOW_CALIBRATION, false, false, function () {
                GUI.log(chrome.i18n.getMessage('initialSetupOpflowCalibStarted'));
            });

            var button = $(this);

            $(button).addClass('disabled');

            // modalProcessing = new jBox('Modal', {
            //     width: 400,
            //     height: 100,
            //     animation: false,
            //     closeOnClick: false,
            //     closeOnEsc: false,
            //     content: $('#modal-opflow-processing')
            // }).open();

            var countdown = 30;
            helper.interval.add('opflow_calibration_interval', function () {
                countdown--;
                $('#modal-opflow-countdown').text(countdown);
                if (countdown === 0) {
                    $(button).removeClass('disabled');

                    //modalProcessing.close();
                    GUI.log(chrome.i18n.getMessage('initialSetupOpflowCalibEnded'));
                    //MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, null);
                    updateSensorData();
                    helper.interval.remove('opflow_calibration_interval');
                }
            }, 1000);
        });

        $('#modal-start-button').click(function () {
            //modalStart.close();
            //TABS.calibration.model += 1;
        });

        $('#modal-stop-button').click(function () {
            //modalStop.close();
        });

        // translate to user-selected language
        localize();

        $('#calibrate-start-button').on('click', calibrateNew);
        //MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, null); // buzz
        updateSensorData();
        GUI.content_ready(callback);
    }
};

TABS.calibration.cleanup = function (callback) {
    if (callback) callback();
};
