/*global chrome */
////'use strict';

TABS.calibration = {};

TABS.calibration.model =  0;

TABS.calibration.initialize = function (callback) {

    var loadChainer = new MSPChainerClass(),
        saveChainer = new MSPChainerClass(),
        modalStart,
        modalStop,
        modalProcessing;

    if (GUI.active_tab != 'calibration') {
        GUI.active_tab = 'calibration';
        //googleAnalytics.sendAppView('Calibration');
    }
    loadChainer.setChain([
        mspHelper.loadStatus,
        mspHelper.loadSensorConfig,
        mspHelper.loadCalibrationData
    ]);
    loadChainer.setExitPoint(loadHtml);
    loadChainer.execute();

    saveChainer.setChain([
        mspHelper.saveCalibrationData,
        mspHelper.saveToEeprom
    ]);
    saveChainer.setExitPoint(reboot);

    function reboot() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('configurationEepromSaved'));

        GUI.tab_switch_cleanup(function() {
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);
        });
    }

    function reinitialize() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('deviceRebooting'));
        GUI.handleReconnect($('.tab_calibration a'));
    }

    function loadHtml() {
        GUI.load("./tabs/calibration.html", processHtml);
    }

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
        if (TABS.calibration.model === 0) {
            modalStop = new jBox('Modal', {
                width: 400,
                height: 200,
                animation: false,
                closeOnClick: false,
                closeOnEsc: false,
                content: $('#modal-acc-calibration-stop')
            }).open();
        }
        updateSensorData();
    }

    // triggered when the 'Calibrate Accelerometer' button is  pressed. zz

    function calibrateNew() {
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
            // modalStart = new jBox('Modal', {
            //     width: 400,
            //     height: 200,
            //     animation: false,
            //     closeOnClick: false,
            //     closeOnEsc: false,
            //     content: $('#modal-acc-calibration-start')
            // }).open();
        } //else {
           // TABS.calibration.model += 1;
           // 
       // }

       // var newStep = TABS.calibration.model;

        // error state, start over
        if (FC.longyREQ > 255 ) { FC.longyREQ = 99999;  } // success

        /*
         * Communication
         */
        //if (TABS.calibration.model == 0 ) {
        $button.addClass('disabled');

//        var notetext = $('div.note').html(); 




        // at FIRST step, we send a COMMAND_LONG , CMD=241 ,ie MAV_CMD_PREFLIGHT_CALIBRATION and 'param5 = 1'
        if ((TABS.calibration.model == 0)  && (FC.longyREQ == 0) ) { 

            preflight_accel_cal(SYSID,COMPID );
            
        }

        if ((TABS.calibration.model == 0)  && (FC.longyREQ == 1) ) { 
            CALIBRATION_DATA.acc['Pos0'] = 1;
            TABS.calibration.model = 1;
            preflight_accel_cal_progress(SYSID,COMPID,TABS.calibration.model);

        } else 
        if (TABS.calibration.model >= 1 ) { 

            preflight_accel_cal_progress(SYSID,COMPID,TABS.calibration.model);
            CALIBRATION_DATA.acc['Pos' + TABS.calibration.model] = 1;
            TABS.calibration.model +=1;
        }

        // 
        if (TABS.calibration.model > 6) {
            TABS.calibration.model =0; 
        }


           

        updateCalibrationSteps();

        // modalProcessing = new jBox('Modal', {
        //     width: 400,
        //     height: 100,
        //     animation: false,
        //     closeOnClick: false,
        //     closeOnEsc: false,
        //     content: $('#modal-acc-processing')
        // }).open();

        //MSP.send_message(MSPCodes.MSP_ACC_CALIBRATION, false, false, function () {
            GUI.log(chrome.i18n.getMessage('initialSetupAccelCalibStarted'));
        //});

        helper.timeout.add('acc_calibration_timeout', function () {
            $button.removeClass('disabled');

            //   modalProcessing.close();
            //   MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, checkFinishAccCalibrate);

            GUI.log(chrome.i18n.getMessage('initialSetupAccelCalibEnded'));
        }, 2000);
       // }
    }

    function processHtml() {
        $('#calibrateButtonSave').on('click', function () {
            CALIBRATION_DATA.opflow.Scale = parseFloat($('[name=OpflowScale]').val());
            //saveChainer.execute();
            preflight_reboot(); // mav
        });

        if (SENSOR_CONFIG.magnetometer === 0) {
            //Comment for test
            $('#mag_btn, #mag-calibrated-data').css('pointer-events', 'none').css('opacity', '0.4');
        }

        if (SENSOR_CONFIG.opflow === 0) {
            //Comment for test
            $('#opflow_btn, #opflow-calibrated-data').css('pointer-events', 'none').css('opacity', '0.4');
        }

        $('#mag_btn').on('click', function () {
            MSP.send_message(MSPCodes.MSP_MAG_CALIBRATION, false, false, function () {
                GUI.log(chrome.i18n.getMessage('initialSetupMagCalibStarted'));
            });

            var button = $(this);

            $(button).addClass('disabled');

            let modalProcessing = new jBox('Modal', {
                width: 400,
                height: 100,
                animation: false,
                closeOnClick: false,
                closeOnEsc: false,
                content: $('#modal-compass-processing').clone()
            }).open();

            var countdown = 30;
            helper.interval.add('compass_calibration_interval', function () {
                countdown--;
                if (countdown === 0) {
                    setTimeout(function () {
                        $(button).removeClass('disabled');

                        modalProcessing.close();
                        GUI.log(chrome.i18n.getMessage('initialSetupMagCalibEnded'));
                        
                        MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, updateSensorData);
                        helper.interval.remove('compass_calibration_interval');

                        //Cleanup
                        delete modalProcessing;
                        $('.jBox-wrapper').remove();
                    }, 1000);
                } else {
                    modalProcessing.content.find('.modal-compass-countdown').text(countdown);
                }

            }, 1000);
        });

        $('#opflow_btn').on('click', function () {
            MSP.send_message(MSPCodes.MSP2_ARDUPILOT_OPFLOW_CALIBRATION, false, false, function () {
                GUI.log(chrome.i18n.getMessage('initialSetupOpflowCalibStarted'));
            });

            var button = $(this);

            $(button).addClass('disabled');

            modalProcessing = new jBox('Modal', {
                width: 400,
                height: 100,
                animation: false,
                closeOnClick: false,
                closeOnEsc: false,
                content: $('#modal-opflow-processing')
            }).open();

            var countdown = 30;
            helper.interval.add('opflow_calibration_interval', function () {
                countdown--;
                $('#modal-opflow-countdown').text(countdown);
                if (countdown === 0) {
                    $(button).removeClass('disabled');

                    modalProcessing.close();
                    GUI.log(chrome.i18n.getMessage('initialSetupOpflowCalibEnded'));
                    MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, updateSensorData);
                    helper.interval.remove('opflow_calibration_interval');
                }
            }, 1000);
        });

        $('#modal-start-button').click(function () {
            //modalStart.close();
            //TABS.calibration.model += 1;
        });

        $('#modal-stop-button').click(function () {
            modalStop.close();
        });

        // translate to user-selected language
        localize();

        $('#calibrate-start-button').on('click', calibrateNew);
        //MSP.send_message(MSPCodes.MSP_CALIBRATION_DATA, false, false, updateSensorData); // buzz

        GUI.content_ready(callback);
    }
};

TABS.calibration.cleanup = function (callback) {
    if (callback) callback();
};
