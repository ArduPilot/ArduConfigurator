//'use strict';

var helper = helper || {};

helper.periodicStatusUpdater = (function () {

    var publicScope = {},
        privateScope = {};

    /**
     *
     * @param {number=} baudSpeed
     * @returns {number}
     */
    publicScope.getUpdateInterval = function (baudSpeed) {

        if (!baudSpeed) {
            baudSpeed = 115200;
        }

        if (baudSpeed >= 115200) {
            return 300;
        } else if (baudSpeed >= 57600) {
            return 600;
        } else if (baudSpeed >= 38400) {
            return 800;
        } else {
            return 1000;
        }
    };

    privateScope.updateView = function () {

        var active = ((Date.now() - MSP.analog_last_received_timestamp) < publicScope.getUpdateInterval(connection.bitrate) * 3);

        if (FC.isModeEnabled('ARM')) // buzz todo put arming info here
            $(".armedicon").css({
                'background-image': 'url("/images/icons/cf_icon_armed_active.svg")'
            });
        else
            $(".armedicon").css({
                'background-image': 'url("/images/icons/cf_icon_armed_grey.svg")'
            });
        if (FC.isModeEnabled('FAILSAFE'))
            $(".failsafeicon").css({
                'background-image': 'url("/images/icons/cf_icon_failsafe_active.svg")'
            });
        else
            $(".failsafeicon").css({
                'background-image': 'url("/images/icons/cf_icon_failsafe_grey.svg")'
            });

        //if (ANALOG != undefined) {
            var nbCells;

            nbCells = ANALOG.cell_count;
            var min = MISC.vbatmincellvoltage * nbCells;
            var max = MISC.vbatmaxcellvoltage * nbCells;
            var warn = MISC.vbatwarningcellvoltage * nbCells;

            $(".battery-status").css({
                width: ANALOG.battery_percentage + "%",
                display: 'inline-block'
            });
        
            if (active) {
                $(".linkicon").css({
                    'background-image': 'url("/images/icons/cf_icon_link_active.svg")'
                });
            } else {
                $(".linkicon").css({
                    'background-image': 'url("/images/icons/cf_icon_link_grey.svg")'
                });
            }

            if (((ANALOG.use_capacity_thresholds && ANALOG.battery_remaining_capacity <= MISC.battery_capacity_warning - MISC.battery_capacity_critical) || (!ANALOG.use_capacity_thresholds && ANALOG.voltage < warn)) || ANALOG.voltage < min) {
                $(".battery-status").css('background-color', '#D42133');
            } else {
                $(".battery-status").css('background-color', '#59AA29');
            }

            $(".battery-legend").text(ANALOG.voltage + " V");

            //---------------
            if (GUI.active_tab == 'calibration') {
                var newtext = "";
                if ( FC.longyREQ == 0) {
                    newtext = "Start Accel Cal? ... press the blue button.";
                    $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again
                }
                if ( FC.longyREQ == 1) {
                    newtext = "Please place vehicle <span style='color:red'>LEVEL NOW</span> then press the button.";
                    $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again
                }
                if ( FC.longyREQ == 2) {
                    newtext = "Please place vehicle on <span style='color:orange'>LEFT SIDE</span> then press the button.";
                    $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again
                }
                if ( FC.longyREQ == 3) {
                    newtext = "Please place vehicle on <span style='color:cyan'>RIGHT SIDE</span> then press the button.";
                    $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again
                }
                if ( FC.longyREQ == 4) {
                    newtext = "Please place vehicle <span style='color:green'>NOSE DOWN</span> then press the button.";
                    $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again
                }
                if ( FC.longyREQ == 5) {
                    newtext = "Please place vehicle <span style='color:blue'>NOSE UP</span> then press the button.";
                    $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again
                }
                if ( FC.longyREQ == 6) {
                    newtext = "Please place vehicle <span style='color:purple'>UPSIDE DOWN</span> then press the button.";
                    $('#calibrate-start-button').css('pointer-events', 'auto').css('opacity', '1.0'); // make 'Calibrate Access' interactive again
                }
                if ( FC.longyREQ > 6) { // 16777215 is greater than 6
                    newtext = "Success!, recommend reboot now.";
                    //FC.longyREQ = 0;
                }
                //$('div.note').html("stage:"+TABS.calibration.model+" "+newtext+" req:"+FC.longyREQ);
                $('div.note').html(newtext+"<br>req:"+FC.longyREQ+"<br>model["+TABS.calibration.model+"]<br>");
                

            }
            //--------------

        //}

        $('#quad-status_wrapper').show();
    };

    publicScope.run = function () {

        if (!CONFIGURATOR.connectionValid) {
            return;
        }

        $(".quad-status-contents").css({
            display: 'inline-block'
        });

        if (GUI.active_tab != 'cli') {

            if (helper.mspQueue.shouldDropStatus()) {
                return;
            }

            // MSP.send_message(MSPCodes.MSP_SENSOR_STATUS, false, false);
            // MSP.send_message(MSPCodes.MSPV2_ARDUPILOT_STATUS, false, false);
            // MSP.send_message(MSPCodes.MSP_ACTIVEBOXES, false, false);
            // MSP.send_message(MSPCodes.MSPV2_ARDUPILOT_ANALOG, false, false);
            // buzz todo, add heartbeat?

            privateScope.updateView();
        }
    };

    return publicScope;
})();
