/*global chrome */
////'use strict';

TABS.calibration = {};

TABS.calibration.model =  0;


TABS.calibration.show_hide_steps = function (sh) {

    console.log('TABS.calibration.show_hide_steps',sh);

    if ( sh == 0 ) {
    // class = step1 etc
        $('div.step1').hide();
        $('div.step2').hide();
        $('div.step3').hide();
        $('div.step4').hide();
        $('div.step5').hide();
        $('div.step6').hide();
    } else {
        $('div.step1').show();
        $('div.step2').show();
        $('div.step3').show();
        $('div.step4').show();
        $('div.step5').show();
        $('div.step6').show();
    }

}

TABS.calibration.initialize = function (callback) {

    //var loadChainer = new MSPChainerClass();
    var saveChainer = new MSPChainerClass();//,
        //modalStart,
        //modalStop,
        //modalProcessing;

    if (GUI.active_tab != 'calibration') {
        GUI.active_tab = 'calibration';
        googleAnalytics.sendAppView('Calibration');
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

    var show_steps = false;
    var start_calib = false;

    var tmp_SERVO_RULES             = new ServoMixerRuleCollection();// while we collect the info as part of the RC calibration, we hold it here till its ready.
    tmp_SERVO_RULES.flush();
    

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


        if ((show_steps == false) && (start_calib == false)) {
            show_steps = true;
            start_calib = true;

            TABS.calibration.show_hide_steps(1);
        }


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
            $('#level_btn').find('a').css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#FDBE02');//.css('a:hover', 'purple'); // test
            level_accel_cal();
            updateSensorData();

        });
        // respond to button press/s
        $('#level_btn2').on('click', function () {
            //CALIBRATION_DATA.opflow.Scale = parseFloat($('[name=OpflowScale]').val());
            //saveChainer.execute();
            //preflight_reboot(); // mav
            $('#level_btn2').find('a').css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#FDBE02');//.css('a:hover', 'purple'); // test

            large_veh_mag_cal(); // assumes yawwed to north if not given by GUI
            updateSensorData();
            // change color of the thing that was clicked.
            //var x = this;
            //$('#'+(this.id)).find('a').css('color', 'red').css('border', 'red').css('background-color', 'yellow').css('a:hover', 'purple'); // test
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
            $('#mag_btn3').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive

            $('#mag_btn').find('a').css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#ffffff');//.css('a:hover', 'purple'); // test

            $('#mag_btn2').find('a').delay(2000).css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#008000');//.css('a:hover', 'purple'); // test
            //  green=success                                                 blue                   blue                              green
            $('#mag_btn2').find('a').delay(3000).animate({backgroundColor: '#ffffff','color': '#37a8db'}, 'slow', 'swing',function() {
                // Animation complete.
                $('#mag_btn2').find('a').removeAttr('style'); // removeAttr removes all attribute styling, returning it 'stock'
                $('#mag_btn2').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive

              }); 
            //  return to stock white/blue after some time                           white             blue 
        
            $('#3d_cal_notes').html("3D Compass CAL ACCEPTED.")
            mag_cal_accept();
            updateSensorData();
        });
        // respond to 'cancel' button press/s
        $('#mag_btn3').on('click', function () {  
            helper.interval.remove('compass_calibration_interval');
            $('#mag_btn2').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive

            $('#mag_btn').find('a').css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#ffffff');//.css('a:hover', 'purple'); // test

            $('#mag_btn3').find('a').delay(2000).css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#008000');//.css('a:hover', 'purple'); // test
            //  green=success-fully cancellded                               blue                   blue                              green
            $('#mag_btn3').find('a').delay(3000).animate({backgroundColor: '#ffffff','color': '#37a8db'}, 'slow', 'swing',function() {
                // Animation complete.
                $('#mag_btn3').find('a').removeAttr('style'); // removeAttr removes all attribute styling, returning it 'stock'
                $('#mag_btn3').css('pointer-events', 'none').css('opacity', '0.4'); // make non-interactive

              }); 
            //  return to stock white/blue after some time                           white             blue 

            $('#3d_cal_notes').html("3D Compass CAL CANCELLED.")
            mag_cal_cancel();
            updateSensorData();
        });
        //  respond to button press/s  ( )
        $('#mag_btn').on('click', function () {

            $('#mag_btn').find('a').css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#FDBE02');//.css('a:hover', 'purple'); // test


            //MSP.send_message(MSPCodes.MSP_MAG_CALIBRATION, false, false, function () {
                GUI.log(chrome.i18n.getMessage('initialSetupMagCalibStarted'));
            //});

            $('#3d_cal_notes').html("Press [Calibrate Compass 3D] then ...<br>Rotate your flight-controller around in 3D space until such time as all red bars get to the top and STAY there.<br></br>");

            if ( FC.curr_mav_state && FC.curr_mav_state['MAG_CAL_PROGRESS'] && FC.curr_mav_state['MAG_CAL_PROGRESS'].completed  ){
                FC.curr_mav_state['MAG_CAL_PROGRESS'].completed = 0;
                FC.curr_mav_state['MAG_CAL_PROGRESS'].completion_mask = String.fromCharCode(0,0,0,0,0,0,0,0,0,0);
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

                // make these match the .css styling for the id=gyrocal <canvas> object
                var canvasWidth = 500;
                var canvasHeight = 50;

                // wipe cancvas
                ctx.fillStyle = "#FFFF99";
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
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
                    var sy = canvasHeight-v/2.4;  // box is 100 tall, and we go to 255
                    var width = 30; // vert bars are 30 wide
                    var height = v/2.4; // goes to bottom 100->255 scaling
                    ctx.fillRect(sx, sy, width, height);
                    
                 });


                //if ((map.width_ != width) || (map.height_ != height)) map.updateSize();
                //map.width_ = width; map.height_ = height;
            }, 200);

          
        });



        // respond to button press/s
        $('#opflow_btn').on('click', function () {
            // MSP.send_message(MSPCodes.MSP2_ARDUPILOT_OPFLOW_CALIBRATION, false, false, function () {
            //     GUI.log(chrome.i18n.getMessage('initialSetupOpflowCalibStarted'));
            // });

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

        $('#calibrate-start-button2').on('click', function() {

          var in_progress = $('#calib_btn2').find('a').text()=='RC Done'?true:false;

          if ( in_progress) { 

              $('#calib_btn2').find('a').text("Start RC Calibration");// set it back after

              helper.interval.remove('rc_calibration_interval'); // remove interval updater.

              $('#calib_btn2').find('a').removeAttr('style'); // removeAttr removes all attribute styling, returning it 'stock'

              // buzz todo get all the min-trim-max values and send them someplae.

          }

          if ( ! in_progress) {
            $('#calib_btn2').find('a').delay(2000).css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#FDBE02');//yellow
            $('#calib_btn2').find('a').text("RC Done");

           // $('#calib_btn2').find('a').delay(2000).css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#008000');// green

            helper.interval.add('rc_calibration_interval', function () {

                var c = document.getElementById("RCcal");  // 200x200pixels
                //let width = $("#gyrocal canvas").width(), height = $("#gyrocal canvas").height();

                if (c == undefined ) return;

                var ctx = c.getContext("2d");

                var canvasWidth = 200;
                var canvasHeight = 200;
                // wipe cancvas
                ctx.fillStyle = "#FFFF99";
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);


                // tip:The upper-left corner of the canvas has the coordinates (0,0)
                // fill-rect goes down-and-to-the-right

                // starting from centre, ofset by ox, oy, then draw a box wxh centred on that point
                function drawbox_from_centre(xc,yc,ox,oy,w,h,fill,verb) {

                    if (verb ) console.log(xc,yc,ox,oy,w,h);

                        var start_left = xc+ox-(w/2); 
                        var start_top =  yc+oy-(h/2);
                        var width = w;
                        var height = h;
                        ctx.fillStyle = fill;//"#CC0000";
                        if (verb )console.log(start_left, start_top, width, height);
                        ctx.fillRect(start_left, start_top, width, height);
                }


                // left x centre
                lxc = 50; // 1/4 of 200
                lyc = 50; // 1/4 of 200

                // right y centre
                rxc = 150; // 3/4 of 200
                ryc = 50;  // 1/4 of 200

                // draw 50x50 squares
                drawbox_from_centre(lxc,lyc,0,0,90,90,"#CCCCFF",false);//light blueish
                drawbox_from_centre(rxc,ryc,0,0,90,90,"#CCCCFF",false);

                //console.log(RC.channels[0]);

                let rules = tmp_SERVO_RULES.get();

                //foreach channel that coming in, if we don't have a rule, make one, if we have a rule, update it.
                for (let RCidx in RC.channels) { 

                    // draw min/max boxesand cache info in tmp_SERVO_RULES

                        if (rules.hasOwnProperty(RCidx)) {
                            const servoRule = rules[RCidx];
                            var x1 = servoRule.getTarget();
                            var x2 = servoRule.getInput();
                            var x3 = servoRule.getRate();
                            var x4 = servoRule.getTrim();
                            var x5 = servoRule.getSpeed();

                            console.log("chan:",RC.channels[RCidx]);

                            rules[RCidx].setTarget(RCidx );
                            rules[RCidx].setInput( x2 );
                            if ( RC.channels[RCidx] < x3) rules[RCidx].setRate( RC.channels[RCidx] );  // min
                            rules[RCidx].setTrim( 1500 );  // trim
                            if ( RC.channels[RCidx] > x5) rules[RCidx].setSpeed( RC.channels[RCidx]); // max

                            // ail
                            if (RCidx == 0 ) {
                                var ylo = ((x3-1000)/10); //0-50
                                var yhi = ((x5-1000)/10); // 0-50
                                drawbox_from_centre(rxc,ryc,ylo,0,yhi,8,"#00BB00",false);
                            }
                            // ele
                            if (RCidx == 1 ) {
                                var ylo = ((x3-1000)/10); //0-100
                                var yhi = ((x5-1000)/10); // 0-100
                              drawbox_from_centre(rxc,ryc,0,0,8,ylo-yhi,"#00BB00",false);
                            }                           
                            // thr
                            if (RCidx == 2 ) {
                                var ylo = ((x3-1000)/10); //0-100
                                var yhi = ((x5-1000)/10); // 0-100
                              drawbox_from_centre(lxc,lyc,0,0,8,ylo-yhi,"#00BB00",false);
                            }                           
                            // rud
                            if (RCidx == 3 ) {
                                var ylo = ((x3-1000)/10); //0-100
                                var yhi = ((x5-1000)/10); // 0-100
                                drawbox_from_centre(lxc,lyc,ylo,0,yhi,8,"#00BB00",false);
                            }
                            //5-8
                            if (RCidx == 4 ) {
                                var ylo = ((x3-1000)/10); //0-100
                                var yhi = ((x5-1000)/10); // 0-100
                                drawbox_from_centre(rxc,ryc+74,-ylo,0,yhi,8,"#009900",false);
                                ctx.font = "12px Arial";
                                ctx.strokeText("CH5 -->", lxc-20,lyc+74+8);      
                            }
                            if (RCidx == 5 ) {
                                var ylo = ((x3-1000)/10); //0-100
                                var yhi = ((x5-1000)/10); // 0-100
                                drawbox_from_centre(rxc,ryc+96,-ylo,0,yhi,8,"#009900",false);
                                ctx.font = "12px Arial";
                                ctx.strokeText("CH6 -->", lxc-20,lyc+96+8); 
                            }
                            if (RCidx == 6 ) {
                                var ylo = ((x3-1000)/10); //0-100
                                var yhi = ((x5-1000)/10); // 0-100
                                drawbox_from_centre(rxc,ryc+118,-ylo,0,yhi,8,"#009900",false);
                                ctx.font = "12px Arial";
                                ctx.strokeText("CH7 -->", lxc-20,lyc+118+8); 
                            }
                            if (RCidx == 7 ) {
                                var ylo = ((x3-1000)/10); //0-100
                                var yhi = ((x5-1000)/10); // 0-100
                                drawbox_from_centre(rxc,ryc+140,-ylo,0,yhi,8,"#009900",false);
                                ctx.font = "12px Arial";
                                ctx.strokeText("CH8 -->", lxc-20,lyc+140+8); 
                            }

                        } else {
                            tmp_SERVO_RULES.put(
                                            new ServoMixRule(
                                                RCidx,
                                                0, // unused right now in tmp_
                                                1500,
                                                1500,
                                                1500
                                            )
                                        );
                        }

                }

                // draw current pos
                // for now we display it 'mode 2' ie Aileron/Ele on right stiuck, Thr/Rudd on left stick
                // ail
                var rc1_pos = Math.round((RC.channels[0]-1000)/10)-50; // starts as 1000-2000 ish, we make it 0-1000, then scale it -50 to 50 as an int
                drawbox_from_centre(rxc,ryc,rc1_pos,0,2,20,"#FF0000",false);
                // ele
                var rc2_pos = Math.round((RC.channels[1]-1000)/10)-50; // starts as 1000-2000 ish, we make it 0-1000, then scale it -50 to 50 as an int
                drawbox_from_centre(rxc,ryc,0,rc2_pos,20,2,"#FF0000",false);
                // thr
                var rc3_pos = Math.round((RC.channels[2]-1000)/10)-50; // starts as 1000-2000 ish, we make it 0-1000, then scale it -50 to 50 as an int
                drawbox_from_centre(lxc,lyc,rc3_pos,0,2,20,"#FF0000",false);
                // rudd
                var rc4_pos = Math.round((RC.channels[3]-1000)/10)-50; // starts as 1000-2000 ish, we make it 0-1000, then scale it -50 to 50 as an int
                drawbox_from_centre(lxc,lyc,0,rc4_pos,20,2,"#FF0000",false);




            }, 200); // buzz todo make 200
          }

        });

        TABS.calibration.show_hide_steps(0);// hide steps to start with

        //MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, null); // buzz
        updateSensorData();
        GUI.content_ready(callback);
    }
};

TABS.calibration.cleanup = function (callback) {
    if (callback) callback();
};
