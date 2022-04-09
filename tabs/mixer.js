/*global $,helper,mspHelper,MSP,GUI,SERVO_RULES,MOTOR_RULES,MIXER_CONFIG,googleAnalytics,LOGIC_CONDITIONS,TABS,ServoMixRule*/
////'use strict';

TABS.mixer = {};

// platformSelect and currentPlatform are used across multiple screens
window.platformSelect  = window.platformSelect??{};
platformSelect = window.platformSelect;
// 
window.currentPlatform = window.currentPlatform??{};
currentPlatform = window.currentPlatform;
console.log('mixer.js platformSelect changed',currentPlatform);


window.$hasFlapsWrapper = $('#has-flaps-wrapper');
$hasFlapsWrapper = window.$hasFlapsWrapper;

window.mixerPreset  = window.mixerPreset??{};
mixerPreset = window.mixerPreset;

// try to keep previous selection when rebuilding selector..
function buzz_veh_sels(prev_selection) {
    

    platformSelect.find("*").remove();

    let platforms = platformList; // airplane,multirotor,rover, etc

    for (let i in platforms) {
        if (platforms.hasOwnProperty(i)) {
            let p = platforms[i];
            var c='';
            if ( (prev_selection.name !== undefined) && (prev_selection.name == p.name) )
                c='selected';
            platformSelect.append('<option value="' + p.id + '" '+c+'>' + p.name + '</option>');
        }
    }

    console.log("here");

    function fillMixerPreset() { 
        if (MIXER_CONFIG.platformType == -1 ) MIXER_CONFIG.platformType = window.currentPlatform.id??-1; // two places we could get it from
        let mixers = helper.mixer.getByPlatform(MIXER_CONFIG.platformType);

        window.mixerPreset.find("*").remove();
        for (i in mixers) {
            if (mixers.hasOwnProperty(i)) {
                let m = mixers[i];
                var p='';
                if ( prev_selection.name == m.name) 
                    p='selected';
                window.mixerPreset.append('<option value="' + m.id + '" '+p+'>' + m.name + '</option>');
            }
        }
    }


    platformSelect.change(function () {


        MIXER_CONFIG.platformType = parseInt(window.platformSelect.val(), 10);

        if (isNaN(MIXER_CONFIG.platformType)) {
            MIXER_CONFIG.platformType = 0;
        }  
        // currentPlatform = helper.platform.getById(MIXER_CONFIG.platformType); 
        currentPlatform =  platformList[MIXER_CONFIG.platformType];

        console.log('mixer.js platformSelect changed',currentPlatform);
        window.currentPlatform = currentPlatform;
        //buzz here


        var platformSelectParent = platformSelect.parent('.select');

        if (currentPlatform.flapsPossible) {
            $hasFlapsWrapper.removeClass('is-hidden');
            platformSelectParent.removeClass('no-bottom-border');
        } else {
            $hasFlapsWrapper.addClass('is-hidden');
            platformSelectParent.addClass('no-bottom-border');
        }

        fillMixerPreset();
        window.mixerPreset.change();

        
    });

    //currentPlatform = helper.platform.getById(MIXER_CONFIG.platformType);
    if ( !MIXER_CONFIG ) {
        MIXER_CONFIG = ALLSETTINGS.MIXER_CONFIG; //on first load user might not have gotten the mixer list/s yet
    }
    if ( ( !MIXER_CONFIG.platformType )||( MIXER_CONFIG.platformType == -1)) {
        MIXER_CONFIG.platformType = prev_selection.id??0; //on first load user might not have selected a type yet.
    }

    currentPlatform =  platformList[MIXER_CONFIG.platformType];

    platformSelect.val(MIXER_CONFIG.platformType).change();


    mixerPreset.change(function () {

        //console.log('PLEASE REFRESH TAB BY VISITING ANOTHER THEN COME BACK');

        // when changing tabs, and under some circumstances, mixerPreset.val can be NaN if the drop-down isn't populated yet.
        console.log("mixerPreset changed",window.mixerPreset.val());
        if(mixerPreset.val() === null ) {
           
            var x = 0;// dounno, pick first one
            window.mixerPreset.val(0);//.change();

        }
     
        const presetId = parseInt(window.mixerPreset.val(), 10);
        currentMixerPreset = helper.mixer.getById(presetId);

        MIXER_CONFIG.appliedMixerPreset = presetId; // buzz 3d chooser

        // in the 'mixer-preset' drop-down, the options are 'Quad X', 'Quad +' , Hex X',  etc
        // presetId is the X for model.js -> mixerList[X]

        // does this 'model.js' template from mixerlist have a frame_class and/or frame_type?
        var parm_tbl = ParamsObj.get_param_table();

        if (parm_tbl == undefined ) return; 
        if ((parm_tbl['FRAME_CLASS'] == undefined ) && (parm_tbl['Q_FRAME_CLASS'] == undefined )) return; 

        // copter frame class stuff 
        if (parm_tbl['FRAME_CLASS'] != undefined ) {
            var Fclass = parm_tbl['FRAME_CLASS'].param_value??'';
            var Ftype = parm_tbl['FRAME_TYPE'].param_value??'';

            if (currentMixerPreset.frame_class ) {
                console.log("This model requires a FRAME_CLASS of ",currentMixerPreset.frame_class);
                if (ardu_frame_classes[Fclass] != currentMixerPreset.frame_class ) {
                    // setting vehicle's FRAME_CLASS..
                    var paramname = 'FRAME_CLASS';
                    var paramvalue = Fclass; 
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,3000); // worst case 3 secs 
                }  
            }
            if (currentMixerPreset.frame_type ) {
                console.log("This model requires a FRAME_TYPE of ",currentMixerPreset.frame_type);
                if (ardu_frame_types[Ftype] != currentMixerPreset.frame_type ) {
                    // setting vehicle's FRAME_TYPE..
                    var paramname = 'FRAME_TYPE';
                    var paramvalue = Ftype; 
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,3000); // worst case 3 secs 
                }  
            }
        }
        //quadplane frame class stuff and optional tilt
        if (parm_tbl['Q_FRAME_CLASS'] != undefined ) {
            var QFclass = parm_tbl['Q_FRAME_CLASS'].param_value??'';
            var QFtype = parm_tbl['Q_FRAME_TYPE'].param_value??'';
            var QTilt = parm_tbl['Q_TILT_TYPE'].param_value??'';

            if (currentMixerPreset.q_frame_class ) {
                console.log("This model requires a Q_FRAME_CLASS of ",currentMixerPreset.q_frame_class);
                if (Qardu_frame_classes[QFclass] != currentMixerPreset.q_frame_class ) {
                    // setting vehicle's FRAME_CLASS..
                    var paramname = 'Q_FRAME_CLASS';
                    var paramvalue = currentMixerPreset.q_frame_class;
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,3000); // worst case 3 secs 
                }  
            }
            if (currentMixerPreset.q_frame_type ) {
                console.log("This model requires a Q_FRAME_TYPE of ",currentMixerPreset.q_frame_type);
                if (Qardu_frame_types[QFtype] != currentMixerPreset.q_frame_type ) {
                    // setting vehicle's FRAME_TYPE..
                    var paramname = 'Q_FRAME_TYPE';
                    var paramvalue = currentMixerPreset.q_frame_type; 
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,3000); // worst case 3 secs 
                }  
            }
            if ((currentMixerPreset.q_tilt_type !== undefined) && (currentMixerPreset.q_tilt_type !== '')) {
                console.log("This model requires a Q_TILT_TYPE of ",currentMixerPreset.q_tilt_type);
                if (Qardu_frame_types[QFtype] != currentMixerPreset.q_frame_type ) {
                    // setting vehicle's FRAME_TYPE..
                    var paramname = 'Q_TILT_TYPE';
                    var paramvalue = currentMixerPreset.q_tilt_type; 
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,3000); // worst case 3 secs 
                }  
            }
        }
        // if (currentMixerPreset.id == 3) {
        //     $wizardButton.parent().removeClass("is-hidden");
        // } else {
        //     $wizardButton.parent().addClass("is-hidden");
        // }

        $('.mixerPreview img').attr('src', './resources/motor_order/'
            + currentMixerPreset.image + '.svg');

               //function content_ready() {
        //    GUI.tab_switch_in_progress = false;
        //}
        // reload current page due to model change? brok bad
        //TABS.setup.initialize(content_ready);
        TABS.setup.initialize3D();
          

    });

    if (MIXER_CONFIG.appliedMixerPreset > -1) {
        window.mixerPreset.val(MIXER_CONFIG.appliedMixerPreset).change();
    } else {
        window.mixerPreset.change();
    }

}

TABS.mixer.initialize = function (callback, scrollPosition) {

    //let loadChainer = new MSPChainerClass();
    let saveChainer = new MSPChainerClass();
    
    //let currentPlatform,
    //    currentMixerPreset,
    let    $servoMixTable,
        $servoMixTableBody,
        $motorMixTable,
        $motorMixTableBody,
        modal,
        motorWizardModal;

    if (GUI.active_tab != 'mixer') {
        GUI.active_tab = 'mixer';
        googleAnalytics.sendAppView('Mixer');
    }

    // loadChainer.setChain([
    //     mspHelper.loadMixerConfig,
    //     mspHelper.loadMotors,
    //     mspHelper.loadServoMixRules,
    //     mspHelper.loadMotorMixRules,
    //     mspHelper.loadOutputMapping,
    //     mspHelper.loadLogicConditions
    // ]);
    // loadChainer.setExitPoint(loadHtml);
    // loadChainer.execute();
    loadHtml();

    saveChainer.setChain([
        mspHelper.saveMixerConfig,
        mspHelper.sendServoMixer,
        mspHelper.sendMotorMixer,
        mspHelper.saveToEeprom
    ]);
    saveChainer.setExitPoint(reboot);

    function reboot() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('configurationEepromSaved'));

        GUI.tab_switch_cleanup(function() {
            //MSP.send_message(MSPCodes.MSP_SET_REBOOT, false, false, reinitialize);
        });
        preflight_reboot(); // mav
    }

    function reinitialize() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('deviceRebooting'));
        GUI.handleReconnect($('.tab_mixer a'));
    }

    function loadHtml() {
        GUI.load("./tabs/mixer.html", processHtml);
    }

    function renderOutputTable() {
        let outputCount = OUTPUT_MAPPING.getOutputCount(),
            $outputRow = $('#output-row'),
            $functionRow = $('#function-row');

        $outputRow.append('<th data-i18n="mappingTableOutput"></th>');
        $functionRow.append('<th data-i18n="mappingTableFunction"></th>');

        for (let i = 1; i <= outputCount; i++) {
            $outputRow.append('<td>S' + i + '</td>');
            $functionRow.append('<td id="function-' + i +'">-</td>');
        }

        $outputRow.find('td').css('width', 100 / (outputCount + 1) + '%');

    }

    function renderOutputMapping() {
        let outputMap = OUTPUT_MAPPING.getOutputTable(
            MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR || MIXER_CONFIG.platformType == PLATFORM_TRICOPTER,
            MOTOR_RULES.getNumberOfConfiguredMotors(),
            SERVO_RULES.getUsedServoIndexes()
        );

        for (let i = 1; i <= OUTPUT_MAPPING.getOutputCount(); i++) {
            $('#function-' + i).html(outputMap[i - 1]);
        }
    }

    function renderServoMixRules() {
        /*
         * Process servo mix table UI
         */
        let rules = SERVO_RULES.get();
        $servoMixTableBody.find("*").remove();
        for (let servoRuleIndex in rules) {
            if (rules.hasOwnProperty(servoRuleIndex)) {
                const servoRule = rules[servoRuleIndex];

                $servoMixTableBody.append('\
                    <tr>\
                    <td><input type="number" class="mix-rule-servo" step="1" min="0" max="15" /></td>\
                    <td><select class="mix-rule-input"></select></td>\
                    <td class="mixer-fixed-value-col"><input type="number" class="mix-rule-fixed-value" min="875" max="2125" disabled /></td> \
                    <td><input type="number" class="mix-rule-rate" step="1" min="975" max="2025" /></td>\
                    <td><input type="number" class="mix-rule-trim" step="1" min="975" max="2025" /></td>\
                    <td><input type="number" class="mix-rule-speed" step="1" min="975" max="2025" /></td>\
                    <td class="mixer-table__condition"></td>\
                    <td><span class="btn default_btn narrow red"><a href="#" data-role="role-servo-delete" data-i18n="servoMixerDelete"></a></span></td>\
                    </tr>\
                ');

                const $row = $servoMixTableBody.find('tr:last');

                GUI.renderLogicConditionSelect(
                    $row.find('.mixer-table__condition'), 
                    LOGIC_CONDITIONS, 
                    servoRule.getConditionId(), 
                    function () {
                        servoRule.setConditionId($(this).val());
                    },
                    true
                );

                GUI.fillSelect($row.find(".mix-rule-input"), FC.getServoMixInputNames(), servoRule.getInput());

                $row.find(".mix-rule-input").val(servoRule.getInput()).change(function () {
                    servoRule.setInput($(this).val());
                    updateFixedValueVisibility($row, $(this));
                });

                $row.find(".mix-rule-servo").val(servoRule.getTarget()).change(function () {
                    servoRule.setTarget($(this).val());
                });

                $row.find(".mix-rule-rate").val(servoRule.getRate()).change(function () {
                    servoRule.setRate($(this).val());
                    //$row.find(".mix-rule-fixed-value").val(mapServoWeightToFixedValue($(this).val()));
                });

                $row.find(".mix-rule-trim").val(servoRule.getTrim()).change(function () {
                    servoRule.setTrim($(this).val());
                    //$row.find(".mix-rule-fixed-value").val(mapServoWeightToFixedValue($(this).val()));
                });

                $row.find(".mix-rule-fixed-value").val(mapServoWeightToFixedValue($row.find(".mix-rule-rate").val()));

                $row.find(".mix-rule-speed").val(servoRule.getSpeed()).change(function () {
                    servoRule.setSpeed($(this).val());
                });

                $row.find("[data-role='role-servo-delete']").attr("data-index", servoRuleIndex);

                updateFixedValueVisibility($row, $row.find(".mix-rule-input"));
            }
        }

       // let rate_inputs = $('.mix-rule-rate');
       // rate_inputs.attr("min", 1000);
       // rate_inputs.attr("max", 2000);

        localize();
    }

    function updateFixedValueVisibility(row, $mixRuleInput) {

        // Show the fixed value input box if "MAX" input was selected for this servo
        const $fixedValueCalcInput = row.find(".mix-rule-fixed-value");
        if (FC.getServoMixInputNames()[$mixRuleInput.val()] === 'MAX') {
            $fixedValueCalcInput.show();
            row.find(".mix-rule-speed").prop('disabled', true);
        } else {
            $fixedValueCalcInput.hide();
            row.find(".mix-rule-speed").prop('disabled', false);
        }

        // Show the Fixed Value column if at least one servo has the "MAX" input assigned
        const $fixedValueCol = $("#servo-mix-table").find(".mixer-fixed-value-col");
        const rules = SERVO_RULES.get();
        for (let servoRuleIndex in rules) {
            if (rules.hasOwnProperty(servoRuleIndex)) {
                if (FC.getServoMixInputNames()[rules[servoRuleIndex].getInput()] === 'MAX') {
                    $fixedValueCol.show();
                    return;
                }
            }
        }
        $fixedValueCol.hide();
    }

    function mapServoWeightToFixedValue(weight) {
        return (parseInt(weight) + 100) * 1000 / 200 + 1000;
    }

    function renderMotorMixRules() {

        /*
         * Process motor mix table UI
         */
        var rules = MOTOR_RULES.get();
        $motorMixTableBody.find("*").remove();
        let index = 0;
        for (const i in rules) {
            if (rules.hasOwnProperty(i)) {
                const rule = rules[i];
                index++;

                $motorMixTableBody.append('\
                    <tr>\
                    <td><span class="mix-rule-motor"></span></td>\
                    <td><input type="number" class="mix-rule-throttle" step="0.001" min="0" max="1" /></td>\
                    <td><input type="number" class="mix-rule-roll" step="0.001" min="-2" max="2" /></td>\
                    <td><input type="number" class="mix-rule-pitch" step="0.001" min="-2" max="2" /></td>\
                    <td><input type="number" class="mix-rule-yaw" step="0.001" min="-2" max="2" /></td>\
                    <td><span class="btn default_btn narrow red"><a href="#" data-role="role-motor-delete" data-i18n="servoMixerDelete"></a></span></td>\
                    </tr>\
                ');

                const $row = $motorMixTableBody.find('tr:last');

                $row.find('.mix-rule-motor').html(index);
                $row.find('.mix-rule-throttle').val(rule.getThrottle()).change(function () {
                    rule.setThrottle($(this).val());
                });
                $row.find('.mix-rule-roll').val(rule.getRoll()).change(function () {
                    rule.setRoll($(this).val());
                });
                $row.find('.mix-rule-pitch').val(rule.getPitch()).change(function () {
                    rule.setPitch($(this).val());
                });
                $row.find('.mix-rule-yaw').val(rule.getYaw()).change(function () {
                    rule.setYaw($(this).val());
                });
                $row.find("[data-role='role-motor-delete']").attr("data-index", i);
            }

        }
        localize();
    }

    function saveAndReboot() {

        /*
         * Send tracking
         */
        googleAnalytics.sendEvent('Mixer', 'Platform type', helper.platform.getById(MIXER_CONFIG.platformType).name);
        googleAnalytics.sendEvent('Mixer', 'Mixer preset',  helper.mixer.getById(MIXER_CONFIG.appliedMixerPreset).name);

        /*
         * Send mixer rules
         */
        SERVO_RULES.cleanup();
        SERVO_RULES.inflate();
        MOTOR_RULES.cleanup();
        MOTOR_RULES.inflate();
        saveChainer.execute();
    }

    function processHtml() {

        $servoMixTable = $('#servo-mix-table');
        $servoMixTableBody = $servoMixTable.find('tbody');
        $motorMixTable = $('#motor-mix-table');
        $motorMixTableBody = $motorMixTable.find('tbody');


       // let platformSelect = $('#platform-type');
            //platforms = helper.platform.getList(),
        let $hasFlapsWrapper = $('#has-flaps-wrapper');
        let $hasFlaps = $('#has-flaps');
        //window.mixerPreset = $('#mixer-preset');
        let $wizardButton = $("#mixer-wizard");

        let platforms = platformList; // 

        motorWizardModal = new jBox('Modal', {
            width: 480,
            height: 410,
            closeButton: 'title',
            animation: false,
            attach: $wizardButton,
            title: chrome.i18n.getMessage("mixerWizardModalTitle"),
            content: $('#mixerWizardContent')
        });

        function validateMixerWizard() {
            let errorCount = 0;
            for (let i = 0; i < 4; i++) {
                const $elements = $('[data-motor] option:selected[id=' + i + ']'),
                    assignedRulesCount = $elements.length;

                if (assignedRulesCount != 1) {
                    errorCount++;
                    $elements.closest('tr').addClass("red-background");
                } else {
                    $elements.closest('tr').removeClass("red-background");
                }

            }

            return (errorCount == 0);
        }

        $(".wizard-motor-select").change(validateMixerWizard);

        $("#wizard-execute-button").click(function () {

            // Validate mixer settings
            if (!validateMixerWizard()) {
                return;
            }

            MOTOR_RULES.flush();

            for (let i = 0; i < 4; i++) {
                const $selects = $(".wizard-motor-select");
                let rule = -1;

                $selects.each(function () {
                    if (parseInt($(this).find(":selected").attr("id"), 10) == i) {
                        rule = parseInt($(this).attr("data-motor"), 10);
                    }
                });

                const r = currentMixerPreset.motorMixer[rule];

                MOTOR_RULES.put(
                    new MotorMixRule(
                        r.getThrottle(),
                        r.getRoll(),
                        r.getPitch(),
                        r.getYaw()
                    )
                );
                
            }

            renderMotorMixRules();
            renderOutputMapping();

            motorWizardModal.close();
        });

        $hasFlaps.prop("checked", MIXER_CONFIG.hasFlaps);
        $hasFlaps.change(function () {
            if ($(this).is(":checked")) {
                MIXER_CONFIG.hasFlaps = 1;
            } else {
                MIXER_CONFIG.hasFlaps = 0;
            }
        });
        $hasFlaps.change();


        var prev_selection = window.currentPlatform; // prev_selection includes .id and .name attrs
        window.platformSelect = $('#platform-type');
        window.mixerPreset = $('#mixer-preset');
        buzz_veh_sels(prev_selection);


        modal = new jBox('Modal', {
            width: 480,
            height: 240,
            closeButton: 'title',
            animation: false,
            attach: $('#load-and-apply-mixer-button'),
            title: chrome.i18n.getMessage("mixerApplyModalTitle"),
            content: $('#mixerApplyContent')
        });

        $('#execute-button').click(function () {
            const presetId = parseInt(window.mixerPreset.val(), 10);
            currentMixerPreset = helper.mixer.getById(presetId);

            helper.mixer.loadServoRules(currentMixerPreset);
            helper.mixer.loadMotorRules(currentMixerPreset);
            renderServoMixRules();
            renderMotorMixRules();
            renderOutputMapping();
            modal.close();
            saveAndReboot();
        });

        $('#load-mixer-button').click(function () {
            const presetId = parseInt(window.mixerPreset.val(), 10); // eg presetID=3 means 'Quad X' ( see model.js /  id: 3 => name: 'Quad X', )
            currentMixerPreset = helper.mixer.getById(presetId);

            helper.mixer.loadServoRules(currentMixerPreset);
            helper.mixer.loadMotorRules(currentMixerPreset);
            renderServoMixRules();
            renderMotorMixRules();
            renderOutputMapping();
        });

        $servoMixTableBody.on('click', "[data-role='role-servo-delete']", function (event) {
            SERVO_RULES.drop($(event.currentTarget).attr("data-index"));
            renderServoMixRules();
            renderOutputMapping();
        });

        $motorMixTableBody.on('click', "[data-role='role-motor-delete']", function (event) {
            MOTOR_RULES.drop($(event.currentTarget).attr("data-index"));
            renderMotorMixRules();
            renderOutputMapping();
        });

        $servoMixTableBody.on('change', "input", function (event) {
            renderOutputMapping();
        });

        $("[data-role='role-servo-add']").click(function () {
            if (SERVO_RULES.hasFreeSlots()) {
                SERVO_RULES.put(new ServoMixRule(0, 0, 1000, 1500, 2000));
                renderServoMixRules();
                renderOutputMapping();
            }
        });

        $("[data-role='role-motor-add']").click(function () {
            if (MOTOR_RULES.hasFreeSlots()) {
                MOTOR_RULES.put(new MotorMixRule(1, 0, 1000, 1500, 2000));
                renderMotorMixRules();
                renderOutputMapping();
            }
        });

        $("[data-role='role-logic-conditions-open']").click(function () {
            //LOGIC_CONDITIONS.open();

            // buzz todo save-servo-outputs now...

            console.log("saving servo setup to verhicle now..") // triggered by 'Save Servo Layout now' button

            // get the rule/s as shown in GUI, and push to
            const rules = SERVO_RULES.get();
            for (let servoRuleIndex in rules) {
                if (rules.hasOwnProperty(servoRuleIndex)) {
                    const servoRule = rules[servoRuleIndex];

                    var servonum =  servoRule.getTarget();// todo buzz rename getTarget etc
                    var servofunc =  servoRule.getInput();
                    var servomin =  servoRule.getRate();
                    var servotrim =  servoRule.getTrim();// named correctly
                    var servomax =  servoRule.getSpeed();
                    
                    // set SERVO1_FUNCTION	
                    var paramname = 'SERVO'+servonum+'_FUNCTION';
                    var paramvalue = servofunc;
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,6000); // worst case a few secs 

                    // set SERVO1_MIN	
                    var paramname = 'SERVO'+servonum+'_MIN';
                    var paramvalue = servomin;
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,6000); // worst case a few secs 

                    // set SERVO1_TRIM	
                    var paramname = 'SERVO'+servonum+'_TRIM';
                    var paramvalue = servotrim;
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,6000); // worst case a few secs  

                    // set SERVO1_MAX	
                    var paramname = 'SERVO'+servonum+'_MAX';
                    var paramvalue = servomax;
                    console.log("setting param:"+paramname+" to:"+paramvalue);
                    ParamsObj.set(paramname,paramvalue,6000); // worst case a few secs 


                    //if (FC.getServoMixInputNames()[servoRule.getInput()] === '...') {
                        //$fixedValueCol.show();
                       // return;
                    //}
                }
            }


        });

        $('#save-button').click(saveAndReboot);

        renderServoMixRules();
        renderMotorMixRules();

        renderOutputTable();
        renderOutputMapping();

        LOGIC_CONDITIONS.init($('#logic-wrapper'));

        localize();

        helper.mspBalancedInterval.add('logic_conditions_pull', 350, 1, getLogicConditionsStatus);

        GUI.content_ready(callback);
    }

    function getLogicConditionsStatus() {
        //mspHelper.loadLogicConditionsStatus(onStatusPullDone); buzz todo refresh data from here maybe?
        onStatusPullDone();
    }

    function onStatusPullDone() {
        LOGIC_CONDITIONS.update(LOGIC_CONDITIONS_STATUS);
    }

};

TABS.mixer.cleanup = function (callback) {
    delete modal;
    delete motorWizardModal;
    $('.jBox-wrapper').remove();
    if (callback) callback();
};
