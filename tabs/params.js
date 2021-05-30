/*global chrome,GUI,FC_CONFIG,$,mspHelper,googleAnalytics,ADVANCED_CONFIG*/
//'use strict';

TABS.params = {};


var ParamsObj = new MavParam(SYSID,COMPID,mavParserObj,null);


TABS.params.initialize = function (callback, scrollPosition) {

    if (GUI.active_tab != 'params') {
        GUI.active_tab = 'params';
        //googleAnalytics.sendAppView('Params');
    }


    //ParamsObj.show_fetched_params(null); //null means all, and it console.logs them....

    //clear old params 
    FC.paramslist = {};
    
    var parm_tbl = ParamsObj.get_param_table(); // this was hopefully already read from vehicle with mav

    // turn it into something the GUI can consume.
    for ( p in parm_tbl ) {
            if (p == "" ) continue; // don't render unnamed params
//            FC.paramslist.push({ 'name': p, 'value': p['param_value'], 'idx': p['param_index'],  'group': 'other', });
//            FC.paramslist.push({ 'name': p, 'value': parm_tbl[p]['param_value'], 'idx': parm_tbl[p]['param_index'],  'group': 'other', });
            FC.paramslist[p] = { 'name': p, 'value': parm_tbl[p]['param_value'], 'idx': parm_tbl[p]['param_index'],  'group': 'other', };

    }


    var craftName = null;
    var loadCraftName = function (callback) {
        if (!CONFIG.name || CONFIG.name.trim() === '') {
            mspHelper.getCraftName(function (name) {
                craftName = name;
                callback();
            });
        } else {
            craftName = CONFIG.name;
            callback();
        }
    };

    var saveCraftName = function (callback) {
        mspHelper.setCraftName(craftName, null);  callback(); // without a response, we'll call the callback anyway
    };

    var loadChainer = new MSPChainerClass();

    var loadChain = [
        mspHelper.loadBfConfig,
        mspHelper.loadArmingConfig,
        mspHelper.loadLoopTime,
        mspHelper.load3dConfig,
        mspHelper.loadSensorAlignment,
        mspHelper.loadAdvancedConfig,
        mspHelper.loadARDUPILOTPidConfig,
        mspHelper.loadSensorConfig,
        mspHelper.loadVTXConfig,
        mspHelper.loadMixerConfig,
        loadCraftName,
        mspHelper.loadMiscV2
    ];

    loadChainer.setChain(loadChain);
    loadChainer.setExitPoint(load_html);
    loadChainer.execute();

    var saveChainer = new MSPChainerClass();

    var saveChain = [
        mspHelper.saveBfConfig,
        mspHelper.save3dConfig,
        mspHelper.saveSensorAlignment,
        mspHelper.saveAccTrim,
        mspHelper.saveArmingConfig,
        mspHelper.saveLooptimeConfig,
        mspHelper.saveAdvancedConfig,
        mspHelper.saveARDUPILOTPidConfig,
        mspHelper.saveSensorConfig,
        mspHelper.saveVTXConfig,
        saveCraftName,
        mspHelper.saveMiscV2,
        saveSettings,
        mspHelper.saveToEeprom
    ];

    function saveSettings(onComplete) {
        Settings.saveInputs().then(onComplete);
    }

    saveChainer.setChain(saveChain);
    saveChainer.setExitPoint(reboot);

    function reboot() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('paramsEepromSaved'));

        GUI.tab_switch_cleanup(function () {
            MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);
        });
    }

    function reinitialize() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('deviceRebooting'));
        GUI.handleReconnect($('.tab_params a'));
    }

    function load_html() {
        GUI.load("./tabs/params.html", Settings.processHtml(process_html));
    }


    function saveParamFile(filename,ext) {
        const fs = require('fs');
        var filedata = '';

        var paramslist = Object.fromEntries(Object.entries(FC.paramslist).sort())   ; // just FC.paramslist only sorted by keys

        for (p in paramslist ) {
            if ( p == "" ) continue;// ignore params with no name
            var val = paramslist[p].value;
            val = parseFloat(val).toFixed(6);
            filedata += p+"    "+val+"\n";
        }
        if ( ! filename.endsWith(ext) ) { filename=filename+ext; }
        fs.writeFile(filename, filedata, (err) => {
            if (err) {
                GUI.log('<span style="color: red">Error writing file</span>');
                return console.error(err);
            }
            GUI.log('File saved');
        });
    }
    function process_html() {

        let i;

        //like resetSettings but on 'params' tab
        //refreshParams
        //saveParams
        //filesaveParams
        //fileloadParams
        $('a.refreshParams').click(function () {
               update_params_global(0,100,true); // show no params loaded
               ParamsObj.getAll(); // todo delay this? - this immediately starts param fetch
        });
        // ie write-to-vehiche
        $('a.saveParams').click(function () {


            var paramslist = Object.fromEntries(Object.entries(FC.paramslist).sort())   ; // just FC.paramslist only sorted by keys

            var paramcount = Object.keys(paramslist).length;

            // this WRITES the entire list to the drone...
            update_params_global(0,paramcount,false);

            // estimate rough total time as 3 params/sec * 1000 for ms
            var timeestimate = paramcount/3 * 1000;

            for (p in paramslist ) {
                if ( p == "" ) continue;// ignore params with no name
                var val = paramslist[p].value;
                console.log("setting param:"+p+" to:"+val);
                ParamsObj.set(p,val,timeestimate); // send to mav as mavlink (gets queue'd for uart if too many)
                // exit early test
                //if ( p == "ACRO_LOCKING") return;
            }
        });



        $('a.filesaveParams').click(function () {

            nwdialog.setContext(document);
            nwdialog.saveFileDialog('', '.parm', function(result) {
                //saveMissionFile(result);
                saveParamFile(result,'.parm');
            })

        });
        $('a.fileloadParams').click(function () {

            nwdialog.setContext(document);
            nwdialog.openFileDialog('.parm', function(filename) {
                const fs = require('fs');
                
                $('div.git_info').slideUp();

                console.log('Loading file from: ' + filename);

                fs.readFile(filename, (err, data) => {

                    if (err) {
                        console.log("Error loading local file", err);
                        return;
                    }

                    console.log('File loaded');

                    //clear old params 
                    FC.paramslist = {};

                    var paramdata = data.toString();
                    var lines = paramdata.split("\n");

                    for ( linenum in lines ) {
                        var line = lines[linenum];
                        var words = line.split(/\s+/); // any whitespaces
                        var name = words[0];
                        var val = words[1];

                        //FC.paramslist.push({ 'name': name, 'value': val,  'group': 'fromfile', });
                        FC.paramslist[name] = { 'name': name, 'value': val,  'group': 'fromfile' };

                    }
                });

            });

        });


        // generate params list
        var paramslist = Object.fromEntries(Object.entries(FC.paramslist).sort())   ; // just FC.paramslist only sorted by keys

        var params_e = $('.params'); // things with class="params " in params.html

        for (i  in  paramslist) { // keys of paramslist obj
            if ( i == "") continue; // skip unnamed param
            var row_e,
                tips = [],
                param_tip_html = '';

                row_e = $('<div class="number"><table width=100%><tr><td width=33%>' +
                paramslist[i].name  +

                '<td width=33%><input type="text" id=params-' + paramslist[i].name + ' class="params" name="' + paramslist[i].name + '" value="' + paramslist[i].value + '">' +

                '<td width=33%><div class="default_btn" style="width: 60%; float:right">' +
                '<a class="writeOneParam" href="#" title="'+i+'" style="display:none;">Write Param</a></div>'+
                    '</tr></table></div>'); // hidden buttons to start with

            params_e.each(function () {
                //if ($(this).hasClass(paramslist[i].group)) {
                  //  $(this).after(row_e); 
                    $(this).before(row_e); // keep alpha order A-Z
                //}
            });
        }


        // the 'write param' button next to each parameter... need sto be done AFTER the above html for the list is rendered to DOM
        $('a.writeOneParam').click(function () {

            var paramname = this.title;
            var input = document.getElementById("params-"+paramname);
            var paramvalue = input.value; // the <input type=text" for the parm

            console.log("setting param:"+paramname+" to:"+paramvalue);
            ParamsObj.set(paramname,paramvalue,3000); // worst case 3 secs 

            $("#params-"+paramname).css('background-color', '#ffffff'); // normal white

            $('a.writeOneParam[title='+paramname+']').hide();


        });

        // when user types any changes to any of the text boxes with values in them..?  ie <inputs> of class 'params'
        //.change event will only fire when the selector has lost focus, so you will need to click somewhere else to have this work.
        // .input fires whenever text changes without need to loose focus
        $('input.params').on('input',function() {

            //console.log("typing..");

            var id = this.id;
            var paramname = this.name;
            var value = this.value;

            var input = document.getElementById("params-"+paramname);


            // is a number, such as floats and ints?
            if (Number(value) == value ) {
                $("#params-"+paramname).css('background-color', '#77ff77'); // a bit green = good but unsaved
                $('a.writeOneParam[title='+paramname+']').show();


            } else {
                $("#params-"+paramname).css('background-color', '#ff7777');  // a bit red = bad, as its not a number
                $('a.writeOneParam[title='+paramname+']').hide();

            }

            // show 'write' after any edit this selector chooses the specific 'writeOneParam' button by its title
            //$('a.writeOneParam[title='+paramname+']').show();

        });


        helper.features.updateUI($('.tab-params'), BF_CONFIG.features);

        // translate to user-selected language
        localize();

        let alignments = FC.getSensorAlignments();
        let orientation_mag_e = $('select.magalign');

        for (i = 0; i < alignments.length; i++) {
            orientation_mag_e.append('<option value="' + (i + 1) + '">' + alignments[i] + '</option>');
        }
        orientation_mag_e.val(SENSOR_ALIGNMENT.align_mag);

        // generate GPS
        var gpsProtocols = FC.getGpsProtocols();
        var gpsSbas = FC.getGpsSbasProviders();

        var gps_protocol_e = $('#gps_protocol');
        for (i = 0; i < gpsProtocols.length; i++) {
            gps_protocol_e.append('<option value="' + i + '">' + gpsProtocols[i] + '</option>');
        }

        gps_protocol_e.change(function () {
            MISC.gps_type = parseInt($(this).val());
        });

        gps_protocol_e.val(MISC.gps_type);

        var gps_ubx_sbas_e = $('#gps_ubx_sbas');
        for (i = 0; i < gpsSbas.length; i++) {
            gps_ubx_sbas_e.append('<option value="' + i + '">' + gpsSbas[i] + '</option>');
        }

        gps_ubx_sbas_e.change(function () {
            MISC.gps_ubx_sbas = parseInt($(this).val());
        });

        gps_ubx_sbas_e.val(MISC.gps_ubx_sbas);

        // VTX
        var config_vtx = $('.config-vtx');
        if (VTX_CONFIG.device_type != VTX.DEV_UNKNOWN) {

            var vtx_band = $('#vtx_band');
            vtx_band.empty();
            var vtx_no_band_note = $('#vtx_no_band');
            if (VTX_CONFIG.band < VTX.BAND_MIN || VTX_CONFIG.band > VTX.BAND_MAX) {
                var noBandName = chrome.i18n.getMessage("paramsNoBand");
                $('<option value="0">' + noBandName + '</option>').appendTo(vtx_band);
                vtx_no_band_note.show();
            } else {
                vtx_no_band_note.hide();
            }
            for (var ii = 0; ii < VTX.BANDS.length; ii++) {
                var band_name = VTX.BANDS[ii].name;
                var option = $('<option value="' + VTX.BANDS[ii].code + '">' + band_name + '</option>');
                if (VTX.BANDS[ii].code == VTX_CONFIG.band) {
                    option.prop('selected', true);
                }
                option.appendTo(vtx_band);
            }
            vtx_band.change(function () {
                VTX_CONFIG.band = parseInt($(this).val());
            });

            var vtx_channel = $('#vtx_channel');
            vtx_channel.empty();
            for (var ii = VTX.CHANNEL_MIN; ii <= VTX.CHANNEL_MAX; ii++) {
                var option = $('<option value="' + ii + '">' + ii + '</option>');
                if (ii == VTX_CONFIG.channel) {
                    option.prop('selected', true);
                }
                option.appendTo(vtx_channel);
            }
            vtx_channel.change(function () {
                VTX_CONFIG.channel = parseInt($(this).val());
            });

            var vtx_power = $('#vtx_power');
            vtx_power.empty();
            var minPower = VTX.getMinPower(VTX_CONFIG.device_type);
            var maxPower = VTX.getMaxPower(VTX_CONFIG.device_type);
            for (var ii = minPower; ii <= maxPower; ii++) {
                var option = $('<option value="' + ii + '">' + ii + '</option>');
                if (ii == VTX_CONFIG.power) {
                    option.prop('selected', true);
                }
                option.appendTo(vtx_power);
            }
            vtx_power.change(function () {
                VTX_CONFIG.power = parseInt($(this).val());
            });

            var vtx_low_power_disarm = $('#vtx_low_power_disarm');
            vtx_low_power_disarm.empty();
            for (var ii = VTX.LOW_POWER_DISARM_MIN; ii <= VTX.LOW_POWER_DISARM_MAX; ii++) {
                var name = chrome.i18n.getMessage("paramsVTXLowPowerDisarmValue_" + ii);
                if (!name) {
                    name = ii;
                }
                var option = $('<option value="' + ii + '">' + name + '</option>');
                if (ii == VTX_CONFIG.low_power_disarm) {
                    option.prop('selected', true);
                }
                option.appendTo(vtx_low_power_disarm);
            }
            vtx_low_power_disarm.change(function () {
                VTX_CONFIG.low_power_disarm = parseInt($(this).val());
            });

            config_vtx.show();
        } else {
            config_vtx.hide();
        }

        // for some odd reason chrome 38+ changes scroll according to the touched select element
        // i am guessing this is a bug, since this wasn't happening on 37
        // code below is a temporary fix, which we will be able to remove in the future (hopefully)
        //noinspection JSValidateTypes
        $('#content').scrollTop((scrollPosition) ? scrollPosition : 0);

        // fill board alignment
        $('input[name="board_align_yaw"]').val((BF_CONFIG.board_align_yaw / 10.0).toFixed(1));

        // fill magnetometer
        $('#mag_declination').val(MISC.mag_declination);

        // fill battery voltage
        $('#voltagesource').val(MISC.voltage_source);
        $('#cells').val(MISC.battery_cells);
        $('#celldetectvoltage').val(MISC.vbatdetectcellvoltage);
        $('#mincellvoltage').val(MISC.vbatmincellvoltage);
        $('#maxcellvoltage').val(MISC.vbatmaxcellvoltage);
        $('#warningcellvoltage').val(MISC.vbatwarningcellvoltage);
        $('#voltagescale').val(MISC.vbatscale);

        // fill current
        $('#currentscale').val(BF_CONFIG.currentscale);
        $('#currentoffset').val(BF_CONFIG.currentoffset / 10);

        // fill battery capacity
        $('#battery_capacity').val(MISC.battery_capacity);
        // next two lines might divide-by-zzero so check that first..
        if ( MISC.battery_capacity == 0 ) MISC.battery_capacity = 0.01; // small but not zero
        $('#battery_capacity_warning').val(MISC.battery_capacity_warning * 100 / MISC.battery_capacity);
        $('#battery_capacity_critical').val(MISC.battery_capacity_critical * 100 / MISC.battery_capacity);
        $('#battery_capacity_unit').val(MISC.battery_capacity_unit);

        let $i2cSpeed = $('#i2c_speed'),
            $i2cSpeedInfo = $('#i2c_speed-info');

        $i2cSpeed.change(function () {
            let $this = $(this),
                value = $this.children("option:selected").text();

            if (value == "400KHZ") {

                $i2cSpeedInfo.removeClass('ok-box');
                $i2cSpeedInfo.addClass('info-box');
                $i2cSpeedInfo.removeClass('warning-box');

                $i2cSpeedInfo.html(chrome.i18n.getMessage('i2cSpeedSuggested800khz'));
                $i2cSpeedInfo.show();

            } else if (value == "800KHZ") {
                $i2cSpeedInfo.removeClass('ok-box');
                $i2cSpeedInfo.removeClass('info-box');
                $i2cSpeedInfo.removeClass('warning-box');
                $i2cSpeedInfo.hide();
            } else {
                $i2cSpeedInfo.removeClass('ok-box');
                $i2cSpeedInfo.removeClass('info-box');
                $i2cSpeedInfo.addClass('warning-box');
                $i2cSpeedInfo.html(chrome.i18n.getMessage('i2cSpeedTooLow'));
                $i2cSpeedInfo.show();
            }

        });

        $i2cSpeed.change();

        let $looptime = $("#looptime"),
            $gyroLpf = $("#gyro-lpf"),
            values = FC.getGyroLpfValues();

        for (i in values) {
            if (values.hasOwnProperty(i)) {
                //noinspection JSUnfilteredForInLoop
                $gyroLpf.append('<option value="' + i + '">' + values[i].label + '</option>');
            }
        }

        if (ARDUPILOT_PID_CONFIG.gyroscopeLpf == null ) ARDUPILOT_PID_CONFIG.gyroscopeLpf = 3; // hack puts it back at default

        $gyroLpf.val(ARDUPILOT_PID_CONFIG.gyroscopeLpf);

        $gyroLpf.change(function () {
            ARDUPILOT_PID_CONFIG.gyroscopeLpf = $gyroLpf.val()??3; // force nul to 3

            var m = FC.getLooptimes();
            var l = FC.getGyroLpfValues();
            var s = ARDUPILOT_PID_CONFIG.gyroscopeLpf;
            var r = l[s];
            var t = r.tick;
            var n = m[t];
            var p = n.looptimes;

            var x = FC.getLooptimes()[FC.getGyroLpfValues()[ARDUPILOT_PID_CONFIG.gyroscopeLpf].tick].looptimes;

            GUI.fillSelect(
                $looptime,
                x,
                FC_CONFIG.loopTime,
                'Hz'
            );
            $looptime.val(FC.getLooptimes()[FC.getGyroLpfValues()[ARDUPILOT_PID_CONFIG.gyroscopeLpf].tick].defaultLooptime);
            $looptime.change();
        });

        $gyroLpf.change();

        $looptime.val(FC_CONFIG.loopTime);
        $looptime.change(function () {
            FC_CONFIG.loopTime = $(this).val();

            if (FC_CONFIG.loopTime < 500) {
                $('#looptime-warning').show();
            } else {
                $('#looptime-warning').hide();
            }
        });
        $looptime.change();

        var $sensorAcc = $('#sensor-acc'),
            $sensorMag = $('#sensor-mag'),
            $sensorBaro = $('#sensor-baro'),
            $sensorPitot = $('#sensor-pitot'),
            $sensorRangefinder = $('#sensor-rangefinder'),
            $sensorOpflow = $('#sensor-opflow');

        GUI.fillSelect($sensorAcc, FC.getAccelerometerNames());
        $sensorAcc.val(SENSOR_CONFIG.accelerometer);
        $sensorAcc.change(function () {
            SENSOR_CONFIG.accelerometer = $sensorAcc.val();
        });


        GUI.fillSelect($sensorMag, FC.getMagnetometerNames());
        $sensorMag.val(SENSOR_CONFIG.magnetometer);
        $sensorMag.change(function () {
            SENSOR_CONFIG.magnetometer = $sensorMag.val();
        });

        GUI.fillSelect($sensorBaro, FC.getBarometerNames());
        $sensorBaro.val(SENSOR_CONFIG.barometer);
        $sensorBaro.change(function () {
            SENSOR_CONFIG.barometer = $sensorBaro.val();
        });

        GUI.fillSelect($sensorPitot, FC.getPitotNames());
        $sensorPitot.val(SENSOR_CONFIG.pitot);
        $sensorPitot.change(function () {
            SENSOR_CONFIG.pitot = $sensorPitot.val();
        });

        GUI.fillSelect($sensorRangefinder, FC.getRangefinderNames());
        $sensorRangefinder.val(SENSOR_CONFIG.rangefinder);
        $sensorRangefinder.change(function () {
            SENSOR_CONFIG.rangefinder = $sensorRangefinder.val();
        });

        GUI.fillSelect($sensorOpflow, FC.getOpticalFlowNames());
        $sensorOpflow.val(SENSOR_CONFIG.opflow);
        $sensorOpflow.change(function () {
            SENSOR_CONFIG.opflow = $sensorOpflow.val();
        });

        $('#3ddeadbandlow').val(REVERSIBLE_MOTORS.deadband_low);
        $('#3ddeadbandhigh').val(REVERSIBLE_MOTORS.deadband_high);
        $('#3dneutral').val(REVERSIBLE_MOTORS.neutral);
        
        // Craft name
        if (craftName != null) {
            $('.config-personalization').show();
            $('input[name="craft_name"]').val(craftName);
        } else {
            // craft name not supported by the firmware
            $('.config-personalization').hide();
        }

        $('a.save').click(function () {
            MISC.mag_declination = parseFloat($('#mag_declination').val());

            ARMING_CONFIG.auto_disarm_delay = parseInt($('input[name="autodisarmdelay"]').val());

            MISC.battery_cells = parseInt($('#cells').val());
            MISC.voltage_source = parseInt($('#voltagesource').val());
            MISC.vbatdetectcellvoltage = parseFloat($('#celldetectvoltage').val());
            MISC.vbatmincellvoltage = parseFloat($('#mincellvoltage').val());
            MISC.vbatmaxcellvoltage = parseFloat($('#maxcellvoltage').val());
            MISC.vbatwarningcellvoltage = parseFloat($('#warningcellvoltage').val());
            MISC.vbatscale = parseInt($('#voltagescale').val());

            MISC.battery_capacity = parseInt($('#battery_capacity').val());
            MISC.battery_capacity_warning = parseInt($('#battery_capacity_warning').val() * MISC.battery_capacity / 100);
            MISC.battery_capacity_critical = parseInt($('#battery_capacity_critical').val() * MISC.battery_capacity / 100);
            MISC.battery_capacity_unit = $('#battery_capacity_unit').val();

            REVERSIBLE_MOTORS.deadband_low = parseInt($('#3ddeadbandlow').val());
            REVERSIBLE_MOTORS.deadband_high = parseInt($('#3ddeadbandhigh').val());
            REVERSIBLE_MOTORS.neutral = parseInt($('#3dneutral').val());

            SENSOR_ALIGNMENT.align_mag = parseInt(orientation_mag_e.val());

            craftName = $('input[name="craft_name"]').val();

            if (FC.isFeatureEnabled('GPS', features)) {
                //googleAnalytics.sendEvent('Setting', 'GpsProtocol', gpsProtocols[MISC.gps_type]);
                //googleAnalytics.sendEvent('Setting', 'GpsSbas', gpsSbas[MISC.gps_ubx_sbas]);
            }

            //googleAnalytics.sendEvent('Setting', 'GPSEnabled', FC.isFeatureEnabled('GPS', features) ? "true" : "false");
            //googleAnalytics.sendEvent("Platform", helper.platform.getById(MIXER_CONFIG.platformType).name, "LPF: " + FC.getGyroLpfValues()[ARDUPILOT_PID_CONFIG.gyroscopeLpf].label + " | Looptime: " + FC_CONFIG.loopTime);

            //googleAnalytics.sendEvent('Setting', 'Looptime', FC_CONFIG.loopTime);
            //googleAnalytics.sendEvent('Setting', 'GyroLpf', FC.getGyroLpfValues()[ARDUPILOT_PID_CONFIG.gyroscopeLpf].label);
            //googleAnalytics.sendEvent('Setting', 'I2CSpeed', $('#i2c_speed').children("option:selected").text());

            //googleAnalytics.sendEvent('Board', 'Accelerometer', FC.getAccelerometerNames()[SENSOR_CONFIG.accelerometer]);
            //googleAnalytics.sendEvent('Board', 'Magnetometer', FC.getMagnetometerNames()[SENSOR_CONFIG.magnetometer]);
            //googleAnalytics.sendEvent('Board', 'Barometer', FC.getBarometerNames()[SENSOR_CONFIG.barometer]);
            //googleAnalytics.sendEvent('Board', 'Pitot', FC.getPitotNames()[SENSOR_CONFIG.pitot]);

            for (var i = 0; i < features.length; i++) {
                var featureName = features[i].name;
                if (FC.isFeatureEnabled(featureName, features)) {
                    //googleAnalytics.sendEvent('Setting', 'Feature', featureName);
                }
            }


            helper.features.reset();
            helper.features.fromUI($('.tab-params'));
            helper.features.execute(function () {
                BF_CONFIG.board_align_yaw = Math.round(parseFloat($('input[name="board_align_yaw"]').val()) * 10);
                BF_CONFIG.currentscale = parseInt($('#currentscale').val());
                BF_CONFIG.currentoffset = Math.round(parseFloat($('#currentoffset').val()) * 10);
                saveChainer.execute();
            });
        });

        helper.interval.add('config_load_analog', function () {
            $('#batteryvoltage').val([ANALOG.voltage.toFixed(2)]);
            $('#batterycurrent').val([ANALOG.amperage.toFixed(2)]);
        }, 100, true); // 10 fps

        GUI.content_ready(callback);
    }
};

TABS.params.cleanup = function (callback) {
    if (callback) callback();
};
