/*global chrome, chrome.i18n*/
//'use strict';

$(document).ready(function () {

    var $port = $('#port'),
        $baud = $('#baud'),
        $portOverride = $('#port-override');

    var last_used_port = ''; 

        chrome.storage.local.get('last_used_port', function (result) {
            if (result.last_used_port) {
                last_used_port=result.last_used_port;
            }
        });

    /*
     * Handle "Wireless" mode with strict queueing of messages
     */
    $('#wireless-mode').change(function () {
        var $this = $(this);

        if ($this.is(':checked')) {
            helper.mspQueue.setLockMethod('hard');
        } else {
            helper.mspQueue.setLockMethod('soft');
        }
    });

    $('#auto-connect').change(function () {
        var $this = $(this);

        if ($this.is(':checked')) {
            helper['autoconnect'] = true; 
        } else {
            helper['autoconnect'] = false;
        }
    });

    $('#tcp-networking').change(function () {
        var $this = $(this);

        if ($this.is(':checked')) {
            helper['tcp-networking'] = true;

            if ( $('#udp-networking').is(':checked')) {
                $('#udp-networking').prop('checked', false).change(); // turn other one off
            }

            console.log("tcp true"); 
            $('div#port-picker #port').val('manual');
            $('#port-override').val('tcp://localhost:5760');
            $('#port-override-option').show();
        } else {
            helper['tcp-networking'] = false;
            console.log("tcp false"); 
            $('#port').val(last_used_port);
           //$('#port-override-option').hide();
        }
    });
    $('#udp-networking').change(function () {
        var $this = $(this);

        if ($this.is(':checked')) {
            helper['udp-networking'] = true; 

            if ( $('#tcp-networking').is(':checked')) {
            $('#tcp-networking').prop('checked', false).change(); // turn other one off
            }

            console.log("udp true"); 
           $('div#port-picker #port').val('manual');
           $('#port-override').val('udp://localhost:14550');
           $('#port-override-option').show();
        } else {
            helper['udp-networking'] = false;
            console.log("udp false"); 
            $('#port').val(last_used_port);
           //$('#port-override-option').hide();
        }
    });

    GUI.handleReconnect = function ($tabElement) {

        let modal;

        if (BOARD.hasVcp(CONFIG.boardIdentifier)) { // VCP-based flight controls may crash old drivers, we catch and reconnect

            modal = new jBox('Modal', {
                width: 400,
                height: 100,
                animation: false,
                closeOnClick: false,
                closeOnEsc: false,
                content: $('#modal-reconnect')
            }).open();

            /*
             Disconnect
             */
            setTimeout(function () {
                $('a.connect').click();
            }, 100);

            /*
             Connect again
             */
            setTimeout(function start_connection() {
                modal.close();
                $('a.connect').click();

                /*
                 Open configuration tab
                 */
                if ($tabElement != null) {
                    setTimeout(function () {
                        $tabElement.click();
                    }, 500);
                }

            }, 7000);
        } else {

            helper.timeout.add('waiting_for_bootup', function waiting_for_bootup() {
                MSP.send_message(MSPCodes.MSP_STATUS, false, false, function () {
                    //noinspection JSUnresolvedVariable
                    //GUI.log(chrome.i18n.getMessage('deviceReady'));
                    //noinspection JSValidateTypes
                    //TABS.configuration.initialize(false, $('#content').scrollTop());
                });
                GUI.log(chrome.i18n.getMessage('deviceReady'));
                TABS.configuration.initialize(false, $('#content').scrollTop());
            },1500); // 1500 ms seems to be just the right amount of delay to prevent data request timeouts
        }
    };

    GUI.updateManualPortVisibility = function(){
        var selected_port = $port.find('option:selected');
        var x = typeof selected_port.data;
        if (  x  != 'function' ) return; // occassionally, its undefined
        var y = selected_port.data()??{isManual: false,isDFU: false}; // fallback for it it doesnt have one
        if (y.isManual) {
            $('#port-override-option').show();
            //$('#port-override-option').value = selected_port.data().value;
        }
        else {
            $('#port-override-option').hide();
        }
        if (y.isDFU) {
            $baud.hide();
        }
        else {
            $baud.show();
        }
    };

    GUI.updateManualPortVisibility();

    $portOverride.change(function () {
        chrome.storage.local.set({'portOverride': $portOverride.val()});
    });

    chrome.storage.local.get('portOverride', function (data) {
        $portOverride.val(data.portOverride);
    });

    $port.change(function (target) {
        GUI.updateManualPortVisibility();
    });

    $('div.connect_controls a.connect').click(function () {
        if (GUI.connect_lock != true) { // GUI control overrides the user control

            var clicks = $(this).data('clicks')??0;
            var selected_baud = parseInt($baud.val());
            // uses 'port' from main drop-down  first, but if 'Manual' is selected, the uses port-override from other box
            if ($port.find('option:selected').data() ) { 
                is_manual = $port.find('option:selected').data().is_manual??0;
            }
            var selected_port = $port.find('option:selected').data().isManual ?
                    $portOverride.val() :
                    String($port.val());

            if (selected_port === 'DFU') {
                GUI.log(chrome.i18n.getMessage('dfu_connect_message'));
            }
            else if (selected_port != '0') {
                if (!clicks) {
                    console.log('Connecting to: ' + selected_port);
                    GUI.connecting_to = selected_port;

                    // lock port select & baud while we are connecting / connected
                    $('#port, #baud, #delay').prop('disabled', true);
                    $('div.connect_controls a.connect_state').text(chrome.i18n.getMessage('connecting'));
                    
                    // despite being called  'connection', it can do serial/tcp/udp  
                    connection.connect(selected_port, {bitrate: selected_baud}, onOpen);

                } else {
                    var wasConnected = CONFIGURATOR.connectionValid;

                    helper.timeout.killAll();
                    helper.interval.killAll(['global_data_refresh', 'msp-load-update']);
                    helper.mspBalancedInterval.flush();

                    GUI.tab_switch_cleanup();
                    GUI.tab_switch_in_progress = false;
                    CONFIGURATOR.connectionValid = false;
                    GUI.connected_to = false;
                    GUI.allowedTabs = GUI.defaultAllowedTabsWhenDisconnected.slice();

                    /*
                     * Flush
                     */
                    helper.mspQueue.flush();
                    helper.mspQueue.freeHardLock();
                    helper.mspQueue.freeSoftLock();

                    connection.disconnect(onClosed);
                    MSP.disconnect_cleanup();

                    // Reset various UI elements
                    $('span.i2c-error').text(0);
                    $('span.cycle-time').text(0);
                    $('span.cpu-load').text('');

                    // unlock port select & baud
                    $port.prop('disabled', false);
                    $baud.prop('disabled', false);

                    // reset connect / disconnect button
                    $('div.connect_controls a.connect').removeClass('active');
                    $('div.connect_controls a.connect_state').text(chrome.i18n.getMessage('connect'));

                    // reset active sensor indicators
                    sensor_status(0);

                    if (wasConnected) {
                        // detach listeners and remove element data
                        $('#content').empty();
                    }

                    //$('#tabs .tab_landing a').click();
                    $('#tabs .tab_setup a').click();
                }

                $(this).data("clicks", !clicks);
            }
        }
    });

    PortHandler.initialize();
});

function onValidFirmware()
{

    googleAnalytics.sendEvent('Board', 'Using', CONFIG.boardIdentifier + ',' + CONFIG.boardVersion);
    GUI.log(chrome.i18n.getMessage('boardInfoReceived', [CONFIG.boardIdentifier, CONFIG.boardVersion]));

    $('#tabs ul.mode-connected .tab_setup a').click();

    updateFirmwareVersion();

}

function onInvalidFirmwareVariant()
{
    GUI.log(chrome.i18n.getMessage('firmwareVariantNotSupported'));
    CONFIGURATOR.connectionValid = true; // making it possible to open the CLI tab
    GUI.allowedTabs = ['cli'];
    onConnect();
    $('#tabs .tab_cli a').click();
}

function onInvalidFirmwareVersion()
{
    GUI.log(chrome.i18n.getMessage('firmwareVersionNotSupported', [CONFIGURATOR.minfirmwareVersionAccepted, CONFIGURATOR.maxFirmwareVersionAccepted]));
    CONFIGURATOR.connectionValid = true; // making it possible to open the CLI tab
    GUI.allowedTabs = ['cli'];
    onConnect();
    $('#tabs .tab_cli a').click();
}

// this callback is triggered AFTER connect button is pressed and 'connection' is open, for serial,tcp udp etc, so handle all.
function onOpen(openInfo) {
    if (openInfo) {
        // update connected_to
        GUI.connected_to = GUI.connecting_to;

        // reset connecting_to
        GUI.connecting_to = false;

        // serial doesn't always set this, so we take the fact that its missing to mean serial..
        if ( openInfo.type == null) openInfo.type = 'serial';

        if ((openInfo.type == 'serial') || (openInfo.type == 'tcp') || (openInfo.type == 'udp')){ 
        GUI.log(chrome.i18n.getMessage('serialPortOpened', [openInfo.connectionId])); // message is vague , works for any Serial/TCP/UDP
        }
    

        // save selected port with chrome.storage if the port differs
        chrome.storage.local.get('last_used_port', function (result) {
            if (result.last_used_port) {
                if ( (result.last_used_port != GUI.connected_to) && (openInfo.type == 'serial')  ) { //last_used_port is for serial-only
                    // last used port doesn't match the one found in local db, we will store the new one
                    chrome.storage.local.set({'last_used_port': GUI.connected_to});
                }
            } else {
                // variable isn't stored yet, saving
                if (openInfo.type == 'serial') {
                    chrome.storage.local.set({'last_used_port': GUI.connected_to});
                }
            }
        });
        
        chrome.storage.local.set({last_used_bps: connection.bitrate});
        chrome.storage.local.set({wireless_mode_enabled: $('#wireless-mode').is(":checked")});
        chrome.storage.local.set({auto_connect_enabled: $('#auto-connect').is(":checked")});
        chrome.storage.local.set({tcp_connect_enabled: $('#tcp-networking').is(":checked")});
        chrome.storage.local.set({udp_connect_enabled: $('#udp-networking').is(":checked")});

        if (openInfo.ip !== undefined) {
          //connection.onReceive.addListener(read_tcp_udp); done elsewhere with mavParserObj.on('message', read_tcp_udp);
        } else { // serial
          connection.onReceive.addListener(read_serial);
        }

        // disconnect after 10 seconds with error if we don't get IDENT data
        helper.timeout.add('connecting', function () {
            if (!CONFIGURATOR.connectionValid) {
                GUI.log(chrome.i18n.getMessage('noConfigurationReceived'));

                //$('div.connect_controls').click(); // disconnect

                var $connectButton = $('#connectbutton');
                $connectButton.find('.connect_state').text(chrome.i18n.getMessage('connect'));
                $connectButton.find('.connect').removeClass('active');
                // unlock port select & baud
                $('#port, #baud, #delay').prop('disabled', false);
                // reset data
                $connectButton.find('.connect').data("clicks", false);

            }
        }, 10000);

        FC.resetState();

        // the following stuff happens once, when the serial port is opened.  for now, we would/could actually 
        // move this from onOpen() to read: function (readInfo) in mavsp.js ...
        // BUT ...  without it HERE  the mav serial stream may not autopromote to mav .V2
        send_heartbeat_handler(); // shrow a heartbeat first, blindly
        set_stream_rates(4); //buzz?

        ParamsObj.getAll(); // todo delay this? - this immediately starts param fetch

        update_dataflash_global();

        autopilot_version_request(); 
        // buzz todo populdate these before posting
        //googleAnalytics.sendEvent('Firmware', 'Variant', CONFIG.flightControllerIdentifier + ',' + CONFIG.flightControllerVersion);


        //onValidFirmware(); //buzz todo we need CONFIG.boardIdentifier and CONFIG.boardVersion set b4 calling this


    } else {
        console.log('Failed to open serial/tcp/udp port');
        GUI.log(chrome.i18n.getMessage('serialPortOpenFail'));

        var $connectButton = $('#connectbutton');

        $connectButton.find('.connect_state').text(chrome.i18n.getMessage('connect'));
        $connectButton.find('.connect').removeClass('active');

        // unlock port select & baud
        $('#port, #baud, #delay').prop('disabled', false);

        // reset data
        $connectButton.find('.connect').data("clicks", false);
    }
}

function onConnect() {
    helper.timeout.remove('connecting'); // kill connecting timer
    $('#connectbutton a.connect_state').text(chrome.i18n.getMessage('disconnect')).addClass('active');
    $('#connectbutton a.connect').addClass('active');
    $('.mode-disconnected').hide();
    $('.mode-connected').show();

    MSP.send_message(MSPCodes.MSP_DATAFLASH_SUMMARY, false, false);

    $('#sensor-status').show();
    $('#portsinput').hide();
    $('#dataflash_wrapper_global').show();

    /*
     * Get BOXNAMES since it is used for some reason....
     */
    MSP.send_message(MSPCodes.MSP_BOXNAMES, false, false);

    /*
     * Init PIDs bank with a length that depends on the version
     */
    let pidCount;
    //if (semver.gte(CONFIG.flightControllerVersion, "2.5.0")) {
        pidCount = 11;
    //} else {
    //    pidCount = 10;
    //}
    for (let i = 0; i < pidCount; i++) {
        PIDs.push(new Array(4));
    }

    helper.interval.add('msp-load-update', function () {
        $('#msp-version').text("MSP version: " + MSP.protocolVersion.toFixed(0));
        $('#msp-load').text("MSP load: " + helper.mspQueue.getLoad().toFixed(1));
        $('#msp-roundtrip').text("MSP round trip: " + helper.mspQueue.getRoundtrip().toFixed(0));
        $('#hardware-roundtrip').text("HW round trip: " + helper.mspQueue.getHardwareRoundtrip().toFixed(0));
        $('#drop-rate').text("Drop ratio: " + helper.mspQueue.getDropRatio().toFixed(0) + "%");
    }, 100);

    helper.interval.add('global_data_refresh', helper.periodicStatusUpdater.run, helper.periodicStatusUpdater.getUpdateInterval(connection.bitrate), false);
}

function onClosed(result) {
    if (result) { // All went as expected
        GUI.log(chrome.i18n.getMessage('serialPortClosedOk'));
    } else { // Something went wrong
        GUI.log(chrome.i18n.getMessage('serialPortClosedFail'));
    }

    $('.mode-connected').hide();
    $('.mode-disconnected').show();

    $('#sensor-status').hide();
    $('#portsinput').show();
    $('#dataflash_wrapper_global').hide();
    $('#quad-status_wrapper').hide();

    updateFirmwareVersion();
}


//static persist it.
// 0 means not-connected-yet
// 1 means connected
// 2 means was-connected
var is_networking_connected = 0;

// a cut-down bit from MSP.read() for tcp/udp conneciton startup/success
// this gets called on every incoming tcp/udp packet wether we are ready for it or not.
function read_tcp_udp(msg) {

    // this function gets (unfortuntely) triggered on serial and tcp, so this next line ignores the serial stuff....
    // ... for serial link/s we do similar param-fetch and set-stream-rates stuff with read_serial calling MSP.read, but only when the serial is 'conected'.
    if ( !msg.udpmavlink ) return; 

    // this.streamrate is pretty arbitrary here, but its what we used in the serial links too
    if (this.streamrate == undefined) {
        console.log("got incoming tcp/udp , sending heartbeat and starting param read")
        send_heartbeat_handler(); // throw a heartbeat first, blindly?
        //set_stream_rates(4,goodpackets[0]._header.srcSystem,goodpackets[0]._header.srcComponent); 
        this.streamrate = 4; 
        ParamsObj.getAll(); // todo delay this? - this immediately starts param fetch
        autopilot_version_request();
    }

    // some form of valid mavlink means we can consider ourselves connected as far as the GUI is concerned
    if (CONFIG && (CONFIGURATOR.connectionValid == false) && (is_networking_connected==0) ) {
        //is_networking_connected = 1;
        console.log("NET CONNECTED!");
        CONFIGURATOR.connectionValid = true;
        CONFIG.flightControllerVersion = "0.0.0"; // buss hack to enable PID pidCount in serial_backend.js 
        updateFirmwareVersion();// show on-gui top-lef
        GUI.allowedTabs = GUI.defaultAllowedTabsWhenConnected.slice();
        onConnect();
        return;// so we don't trigger an immediate disconnect
    }

    // we don't do disconnect stuff here, as its triggered by a button-press, NOT mavlink stream, so see connection.js->connectTcporUdp->disconnect


    this.last_received_timestamp = Date.now();
}

// for historical reasons, its called MSP.read
function read_serial(info) {

        MSP.read(info);
}

/**
 * Sensor handler used in ARDUPILOT >= 1.5
 * @param hw_status
 */
function sensor_status_ex(hw_status)
{
    var statusHash = sensor_status_hash(hw_status);

    if (sensor_status_ex.previousHash == statusHash) {
        return;
    }

    sensor_status_ex.previousHash = statusHash;

    sensor_status_update_icon('.gyro',      '.gyroicon',        hw_status.gyroHwStatus);
    sensor_status_update_icon('.accel',     '.accicon',         hw_status.accHwStatus);
    sensor_status_update_icon('.mag',       '.magicon',         hw_status.magHwStatus);
    sensor_status_update_icon('.baro',      '.baroicon',        hw_status.baroHwStatus);
    sensor_status_update_icon('.gps',       '.gpsicon',         hw_status.gpsHwStatus);
    sensor_status_update_icon('.sonar',     '.sonaricon',       hw_status.rangeHwStatus);
    sensor_status_update_icon('.airspeed',  '.airspeedicon',    hw_status.speedHwStatus);
    sensor_status_update_icon('.opflow',    '.opflowicon',      hw_status.flowHwStatus);
}

function sensor_status_update_icon(sensId, sensIconId, status)
{
    var e_sensor_status = $('#sensor-status');

    if (status == 0) {
        $(sensId, e_sensor_status).removeClass('on');
        $(sensIconId, e_sensor_status).removeClass('active');
        $(sensIconId, e_sensor_status).removeClass('error');
    }
    else if (status == 1) {
        $(sensId, e_sensor_status).addClass('on');
        $(sensIconId, e_sensor_status).addClass('active');
        $(sensIconId, e_sensor_status).removeClass('error');
    }
    else {
        $(sensId, e_sensor_status).removeClass('on');
        $(sensIconId, e_sensor_status).removeClass('active');
        $(sensIconId, e_sensor_status).addClass('error');
    }
}

function sensor_status_hash(hw_status)
{
    return "S" +
           hw_status.isHardwareHealthy +
           hw_status.gyroHwStatus +
           hw_status.accHwStatus +
           hw_status.magHwStatus +
           hw_status.baroHwStatus +
           hw_status.gpsHwStatus +
           hw_status.rangeHwStatus +
           hw_status.speedHwStatus +
           hw_status.flowHwStatus;
}

/**
 * Legacy sensor handler used in ARDUPILOT < 1.5 versions
 * @param sensors_detected
 * @deprecated
 */
function sensor_status(sensors_detected) {

    if (typeof SENSOR_STATUS === 'undefined') {
        return;
    }

    SENSOR_STATUS.isHardwareHealthy = 1;
    SENSOR_STATUS.gyroHwStatus      = have_sensor(sensors_detected, 'gyro') ? 1 : 0;
    SENSOR_STATUS.accHwStatus       = have_sensor(sensors_detected, 'acc') ? 1 : 0;
    SENSOR_STATUS.magHwStatus       = have_sensor(sensors_detected, 'mag') ? 1 : 0;
    SENSOR_STATUS.baroHwStatus      = have_sensor(sensors_detected, 'baro') ? 1 : 0;
    SENSOR_STATUS.gpsHwStatus       = have_sensor(sensors_detected, 'gps') ? 1 : 0;
    SENSOR_STATUS.rangeHwStatus     = have_sensor(sensors_detected, 'sonar') ? 1 : 0;
    SENSOR_STATUS.speedHwStatus     = have_sensor(sensors_detected, 'airspeed') ? 1 : 0;
    SENSOR_STATUS.flowHwStatus      = have_sensor(sensors_detected, 'opflow') ? 1 : 0;
    sensor_status_ex(SENSOR_STATUS);
}

function have_sensor(sensors_detected, sensor_code) {
    switch(sensor_code) {
        case 'acc':
        case 'gyro':
            return bit_check(sensors_detected, 0);
        case 'baro':
            return bit_check(sensors_detected, 1);
        case 'mag':
            return bit_check(sensors_detected, 2);
        case 'gps':
            return bit_check(sensors_detected, 3);
        case 'sonar':
            return bit_check(sensors_detected, 4);
        case 'opflow':
            return bit_check(sensors_detected, 5);
        case 'airspeed':
            return bit_check(sensors_detected, 6);
    }
    return false;
}

function highByte(num) {
    return num >> 8;
}

function lowByte(num) {
    return 0x00FF & num;
}

function specificByte(num, pos) {
    return 0x000000FF & (num >> (8 * pos));
}

function bit_check(num, bit) {
    return ((num >> bit) % 2 != 0);
}

function bit_set(num, bit) {
    return num | 1 << bit;
}

function bit_clear(num, bit) {
    return num & ~(1 << bit);
}


function update_params_complete() {
    function content_ready() {
        GUI.tab_switch_in_progress = false;
    }
   // GUI.tab_switch_in_progress = true;
   // TABS.params.initialize(content_ready);
    // buzz todo get 'params' tab to re-render
   // alert("Param Download Complete - exit and reenter any tab to refresh gui");

    //GUI.tab_switch_cleanup();

    $(".params_global").css( "background-color","#22dd44"  );  // green=done

    
}


function update_params_global(used,total, down=true) {

   // $(".noflash_global").css({
   //     display: 'none'
   //  });

   //  $(".dataflash-contents_global").css({
   //     display: 'block'
   //  });
    //var progress_percent = total/current; 

    if (used == 65535 )  return; // do nothing yet

    $(".params_global").css( "background-color","#37a8db"  ); // blue=progress

     $(".params_global").css({
        width: (100-(total - used) / total * 100) + "%",
        display: 'block'
     });
     if ( down)  $(".params_global div").text('Params Download...');
     if ( ! down)  $(".params_global div").text('Params Upload...');


}

function update_dataflash_global() {
    function formatFilesize(bytes) {
        if (bytes < 1024) {
            return bytes + "B";
        }
        var kilobytes = bytes / 1024;

        if (kilobytes < 1024) {
            return Math.round(kilobytes) + "kB";
        }

        var megabytes = kilobytes / 1024;

        return megabytes.toFixed(1) + "MB";
    }

    // buzz hack
    var supportsDataflash = true; //DATAFLASH.totalSize > 0;
    DATAFLASH.totalSize = 1024; 
    DATAFLASH.usedSize = 512;

    if (supportsDataflash){
        $(".noflash_global").css({
           display: 'none'
        });

        $(".dataflash-contents_global").css({
           display: 'block'
        });

        $(".dataflash-free_global").css({
           width: (100-(DATAFLASH.totalSize - DATAFLASH.usedSize) / DATAFLASH.totalSize * 100) + "%",
           display: 'block'
        });
        $(".dataflash-free_global div").text('Dataflash: free ' + formatFilesize(DATAFLASH.totalSize - DATAFLASH.usedSize));
     } else {
        $(".noflash_global").css({
           display: 'block'
        });

        $(".dataflash-contents_global").css({
           display: 'none'
        });
     }
}
