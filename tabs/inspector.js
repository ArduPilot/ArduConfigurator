/*global chrome,GUI,FC_CONFIG,$,mspHelper,googleAnalytics,ADVANCED_CONFIG*/
//'use strict';

TABS.inspector = {};


//var InspectorObj = new MavParam(SYSID,COMPID,mavParserObj,null);


TABS.inspector.initialize = function (callback, scrollPosition) {

    if (GUI.active_tab != 'inspector') {
        GUI.active_tab = 'inspector';
        googleAnalytics.sendAppView('Inspector');
    }

    //clear old inspector 
    FC.inspectorlist = FC.curr_mav_state;
    

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

    load_html();

  
    function reboot() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('inspectorEepromSaved'));

        GUI.tab_switch_cleanup(function () {  });
        preflight_reboot(); // mav
    }

    function reinitialize() {
        //noinspection JSUnresolvedVariable
        GUI.log(chrome.i18n.getMessage('deviceRebooting'));
        GUI.handleReconnect($('.tab_inspector a'));
    }

    function load_html() {
        GUI.load("./tabs/inspector.html", Settings.processHtml(process_html));
    }


    function saveParamFile(filename,ext) {
        const fs = require('fs');
        var filedata = '';
       
        GUI.log('File saved');

    }
    function process_html() {

        let i;


        $('a.refreshInspector').click(function () {

        });
        $('a.saveInspector').click(function () {

        });
        $('a.filesaveInspector').click(function () {

        });
        $('a.fileloadInspector').click(function () {

        });

        var inspector_e = $('.inspector'); // things with class="inspector " in inspector.html

        // var blerg = `<div>
        // <h3>Root</h3>
        // <ul>        
        //   <li>SysID 1
        //     <ul>
        //         <li>CompID 1
        //             <ul>
        //                 <li>file1.xml</li>
        //                 <li>file2.xml</li>
        //                 <li>file3.xml</li>
        //             </ul>
        //         </li>
        //         <li>file.html</li>
        //       </ul>
        //   </li>
        //   <li>file.psd</li>
        //   <li>file.cpp</li>
        // </ul>
        // </div>`;

        // $('#blerg').html('blerg');

        for (i  in  FC.inspectorlist) { // keys of inspectorlist obj
            if ( i == "") continue; // skip unnamed param

            var row_e =  $('<li>' + i  + '<ul>'); // hidden buttons to start with
            $('#blerg').before(row_e);

            var obj = FC.inspectorlist[i];
            for ( z in obj){
                var t = obj[z];

                // arrays need to be a bit more than just displaed, as they are "longs" from mav's long.js
                if (Array.isArray(t)) {
                    console.log(t[0],t[1],t[2]);
                    t = "["+t[0]+","+t[1]+","+t[2]+"]"; // array of length 3 for 64bit stuff lower,upper,signedbool
                }
                var displayme = z + "&nbsp;&nbsp;&nbsp;...&nbsp;&nbsp;&nbsp;&nbsp;<span id='insp_"+i+"_"+z+"'>" +  t +"</span>";
                var row_f =  $('<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + displayme  + '</li>'); // hidden buttons to start with
                $('#blerg').before(row_f);

            }

            var row_e =  $('</ul></li>'); // hidden buttons to start with
            $('#blerg').before(row_e);

        }

        $('a.writeOneParam').click(function () {

        });

        $('input.inspector').on('input',function() {

        });

        helper.features.updateUI($('.tab-inspector'), BF_CONFIG.features);

        // translate to user-selected language
        localize();

        // for some odd reason chrome 38+ changes scroll according to the touched select element
        // i am guessing this is a bug, since this wasn't happening on 37
        // code below is a temporary fix, which we will be able to remove in the future (hopefully)
        //noinspection JSValidateTypes
        $('#content').scrollTop((scrollPosition) ? scrollPosition : 0);

        // fill board alignment
        $('input[name="board_align_yaw"]').val((BF_CONFIG.board_align_yaw / 10.0).toFixed(1));


        $('a.save').click(function () {
            

            helper.features.reset();
            helper.features.fromUI($('.tab-inspector'));
            helper.features.execute(function () {

            });
        });

        helper.interval.add('config_load_analog', function () {


            for (i  in  FC.inspectorlist) { // keys of inspectorlist obj
                if ( i == "") continue; // skip unnamed param
    
               // var row_e =  $('<li>' + i  + '<ul>'); // hidden buttons to start with
               // $('#').before(row_e);
    
                var obj = FC.inspectorlist[i];
                for ( z in obj){
    
                    var t = obj[z];

                    // arrays need to be a bit more than just displaed, as they are "longs" from mav's long.js
                    if (Array.isArray(t)) {
                        console.log(t[0],t[1],t[2]);
                        t = "["+t[0]+","+t[1]+","+t[2]+"]"; // array of length 3 for 64bit stuff lower,upper,signedbool
                    }
                   // var displayme = z + "&nbsp;&nbsp;&nbsp;...&nbsp;&nbsp;&nbsp;&nbsp;<span id='"+z+"'>" +  obj[z] +"</span>";
                    //var row_f =  $('<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + displayme  + '</li>'); // hidden buttons to start with
                    $('#insp_'+i+'_'+z).html(t);
                }
    
               // var row_e =  $('</ul></li>'); // hidden buttons to start with
                //$('#blerg').before(row_e);
    
            }
            
            // todo buzz refresh....
        }, 100, true); // 10 fps

        GUI.content_ready(callback);
    }
};

TABS.inspector.cleanup = function (callback) {
    if (callback) callback();
};
