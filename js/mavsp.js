//'use strict';

var send_heartbeat_handler = function() {
    //console.log("hb handler");
       var heartbeat = new mavlink20.messages.heartbeat(); 
          heartbeat.custom_mode = 963497464; // fieldtype: uint32_t  isarray: False 
          heartbeat.type = 17; // fieldtype: uint8_t  isarray: False 
          heartbeat.autopilot = 84; // fieldtype: uint8_t  isarray: False 
          heartbeat.base_mode = 151; // fieldtype: uint8_t  isarray: False 
          heartbeat.system_status = 218; // fieldtype: uint8_t  isarray: False 
          heartbeat.mavlink_version = 3; // fieldtype: uint8_t  isarray: False 
    
          mavParserObj.send(heartbeat,255); // we don't know the sysid yet, so 255 as a broadcast ip is ok.
}
    
var set_stream_rates = function(rate,target_system,target_component) {
// mavproxy uses a stream_rate of 4 on its links by default, so we'll just use that...
//target_system, target_component, req_stream_id, req_message_rate, start_stop

    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;

    if (rate == undefined )rate = 4;

    var packet = new mavlink20.messages.request_data_stream(target_system,target_component,
                                mavlink20.MAV_DATA_STREAM_ALL,rate, 1);

    mavParserObj.send(packet); 
    console.log('Set Stream Rates =4');

}

var preflight_accel_cal = function(target_system,target_component) {

    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;

    // this.target_system , 
    // this.target_component , 
    // this.command , 
    // this.confirmation , 
    // this.param1 , 
    // this.param2 , 
    // this.param3 ,
    // this.param4 , 
    // this.param5 , 
    // this.param6 , 
    // this.param7

    var packet = new mavlink20.messages.command_long(target_system,target_component,
        mavlink20.MAV_CMD_PREFLIGHT_CALIBRATION,
        0, // confirmation
        0,0,0,0,1,0,0 // params 1-7, param5=1 means 'accelerometer calibration'
        );

    mavParserObj.send(packet); 
    console.log('Send accel preflight cal');
}


var preflight_accel_cal_progress = function (target_system,target_component, step=1) {


    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;

  //  vehicle sends:  MAV_CMD_ACCELCAL_VEHICLE_POS = 42429// # Used when doing accelerometer calibration. When sent to the GCS tells
   //                         //# it what position to put the vehicle in. When
     //                       //# sent to the vehicle says what position the
       //                     //# vehicle is in. 

    //    this.command , 
    //    this.result , 
    //    this.progress , 
    //    this.result_param2 , 
    //    this.target_system , 
    //    this.target_component

       var packet = new mavlink20.messages.command_ack(
        mavlink20.MAVLINK_MSG_ID_COMMAND_ACK,
        step, // result
        1, // progress
        0, //result2/param2
        target_system,
        target_component,
        );

    mavParserObj.send(packet); 
    console.log('Send accel preflight progress');

}


var preflight_reboot = function (target_system,target_component) {

    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;
    

    var packet = new mavlink20.messages.command_long(target_system,target_component,
        mavlink20.MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN,
        0, // confirmation
        1,0,1,0,0,0,0 // params 1-7
        );

    mavParserObj.send(packet); 
    console.log('Send preflight_reboot!');
}

var large_veh_mag_cal = function (yaw_heading, target_system,target_component ) {

    if (yaw_heading == undefined )yaw_heading = 1; // north if not given

    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;

    var packet = new mavlink20.messages.command_long(target_system,target_component,
        mavlink20.MAV_CMD_FIXED_MAG_CAL_YAW, // 42006
        0, // confirmation
        yaw_heading,0,0,0,0,0,0 // params 1-7  // as per MP's button
        );

    mavParserObj.send(packet); 
    console.log('Send large_veh_mag_cal!');

    // add temporary hook to listen for ACK, eg COMMAND_ACK command= 42006 result= 4
    //https://github.com/mavlink/c_library_v2/blob/master/common/mavlink_msg_command_ack.h
    var m1 = mavlinkParser.on('COMMAND_ACK', function(ack) {
            var from = this;
            if ( ( ack.command == mavlink20.MAV_CMD_FIXED_MAG_CAL_YAW )  && (ack.result == 4 ) ) {  // 4 -= success?

                console.log('Send large_veh_mag_cal REPLIED');

                // after getting an acknowledgement in the mavlink stream, stop listening
                mavlinkParser.off('COMMAND_ACK',m1 ); // note we pass in the uuid 'm1' here be be sure we remove the *correct* 'off' hook

                $('#level_btn2').find('a').delay(2000).css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#008000');//.css('a:hover', 'purple'); // test
                //  green=success                                                 blue                   blue                              green
                $('#level_btn2').find('a').delay(3000).animate({backgroundColor: '#ffffff','color': '#37a8db'}, 'slow', 'swing',function() {
                    // Animation complete.
                    $('#level_btn2').find('a').removeAttr('style'); // removeAttr removes all attribure styling, returning it 'stock'
                  }); 
                //  return to stock white/blue after some time                           white             blue 
     
            }   

        }
    );
}


var level_accel_cal = function ( target_system,target_component ) {

    // this is nearly exactly a  preflight_accel_cal(); but param5=1 means 'accelerometer calibration' and we use param5=2

    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;

    var packet = new mavlink20.messages.command_long(target_system,target_component,
        mavlink20.MAV_CMD_PREFLIGHT_CALIBRATION, // 241
        0, // confirmation
        0,0,0,0,2,0,0 // params 1-7  // as per MP's "Calibrate Level" button in the 'Accel Calibration' screen.   param5=2
        );

    mavParserObj.send(packet); 
    console.log('Send level_accel_cal!');

    // add temporary hook to listen for ACK, eg COMMAND_ACK command= 42006 result= 4
    //https://github.com/mavlink/c_library_v2/blob/master/common/mavlink_msg_command_ack.h
    var m1 = mavlinkParser.on('COMMAND_ACK', function(ack) {
        var from = this;
        if ( ( ack.command == mavlink20.MAV_CMD_PREFLIGHT_CALIBRATION )  && (ack.result == 0 ) ) {  // 0 = success? buzz todo

            console.log('Send level_accel_cal REPLIED');

            // after getting an acknowledgement in the mavlink stream, stop listening
            mavlinkParser.off('COMMAND_ACK',m1 ); // note we pass in the uuid 'm1' here be be sure we remove the *correct* 'off' hook

            $('#level_btn').find('a').delay(2000).css('border', '1px solid #37a8db').css('color', '#37a8db').css('background-color', '#008000');//.css('a:hover', 'purple'); // test
            //  green=success                                                 blue                   blue                              green
            $('#level_btn').find('a').delay(3000).animate({backgroundColor: '#ffffff','color': '#37a8db'}, 'slow', 'swing',function() {
                // Animation complete.
                $('#level_btn').find('a').removeAttr('style'); // removeAttr removes all attribure styling, returning it 'stock'
              }); 
            //  return to stock white/blue after some time                           white             blue 
 
        }   

    }
    );
}

// list of the sorts of waypoint or mission_command/s we can do...
//MAV_CMD_NAV_  => see mission_control.js 

var nav_commands = {};
// find all attrs that start with MAV_CMD_NAV_;
for (attr in mavlink20 ) {  
    //MAV_CMD_NAV_WAYPOINT etc
    if (attr.startsWith('MAV_CMD_NAV_') ) {
        var shortname = attr.replace('MAV_CMD_NAV_','');//drop long prefix
        // for now, lets leave out the FENCE_* stuff...
        if (! attr.startsWith('MAV_CMD_NAV_FENCE_') ) {
        nav_commands[shortname] = mavlink20[attr]; 
        }
    }
}



// start  = 42424 / 0,1,1,0,0,0,0
// accept = 42425 / 0,0,1,0,0,0,0
// cancel = 42426 / 0,0,1,0,0,0,0
var mag_cal_start = function ( target_system,target_component ) {
    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;
    var packet = new mavlink20.messages.command_long(target_system,target_component,
        mavlink20.MAV_CMD_DO_START_MAG_CAL, // 42424
        0, // confirmation
        0,1,1,0,0,0,0 // params 1-7  // as per MP's "Onboard Mag Cal" -> "Start" button in the 'Compass' screen. 
        );
    mavParserObj.send(packet); 
    console.log('Send mag_cal_start!');
}
var mag_cal_accept = function ( target_system,target_component ) {
    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;
    var packet = new mavlink20.messages.command_long(target_system,target_component,
        mavlink20.MAV_CMD_DO_ACCEPT_MAG_CAL, // 42425
        0, // confirmation
        0,0,1,0,0,0,0 // params 1-7  // as per MP's "Onboard Mag Cal" -> "Accept" button in the 'Compass' screen. 
        );
    mavParserObj.send(packet); 
    console.log('Send mag_cal_accept!');
}
var mag_cal_cancel = function ( target_system,target_component ) {
    if (target_system == undefined )target_system = SYSID;
    if (target_component == undefined )target_component = COMPID;
    var packet = new mavlink20.messages.command_long(target_system,target_component,
        mavlink20.MAV_CMD_DO_CANCEL_MAG_CAL, // 42426
        0, // confirmation
        0,0,1,0,0,0,0 // params 1-7  // as per MP's "Onboard Mag Cal" -> "Cancel" button in the 'Compass' screen. 
        );
    mavParserObj.send(packet); 
    console.log('Send mag_cal_cancel!');
}



//     specific msg handler, for flight mode/s and sysid record keeping
var heartbeat_handler =  function(message) {
    //console.log(message);
    var tmp_sysid = message._header.srcSystem;

    // don't allow messages that appear to come from 255 to be handled.
    if (message._header.srcSystem == 255 ) { return;  }

    if (SYSID == undefined ) { return;  } // haven't set the sysid global yet, elsewhere.

    if (FC.curr_mav_state['HEARTBEAT'] == undefined ) { return;} // the other handler/s haven't run yet, delay this one

    // alight ardupilot vehicle 'type' with inav 'platformType'
    if ( FC.curr_mav_state['HEARTBEAT'].type ==  mavlink20.MAV_TYPE_FIXED_WING ) 
        MIXER_CONFIG.platformType = PLATFORM_AIRPLANE ;
    if ( FC.curr_mav_state['HEARTBEAT'].type == mavlink20.MAV_TYPE_QUADROTOR )
        MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR ;
    if ( FC.curr_mav_state['HEARTBEAT'].type == mavlink20.MAV_TYPE_HEXAROTOR )
        MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR ;
    if ( FC.curr_mav_state['HEARTBEAT'].type == mavlink20.MAV_TYPE_OCTOROTOR )
        MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR ;
    if ( FC.curr_mav_state['HEARTBEAT'].type == mavlink20.MAV_TYPE_HELICOPTER ) // normal trad-heli
        MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR ;
    if ( FC.curr_mav_state['HEARTBEAT'].type == mavlink20.MAV_TYPE_TRICOPTER ) 
        MIXER_CONFIG.platformType == PLATFORM_TRICOPTER ;
    if ( FC.curr_mav_state['HEARTBEAT'].type == mavlink20.MAV_TYPE_GROUND_ROVER ) 
        MIXER_CONFIG.platformType == PLATFORM_ROVER ;
    // buzz todo add boat, etc etc here 


    // don't go past this point unless its the first time we've seen this sysid
    if ( sysids[SYSID] == true ) { return;  }  //if we don't have a 'current vehicle' sysid defined


    // mode change hook/s:
    // assemble a new MavFlightMode hook to watch for this sysid:
    mavFlightModes.push(new MavFlightMode(mavlink20, mavParserObj, null, logger,tmp_sysid));
    mavFlightModes_rehook();
    sysids[SYSID] = true;

}
mavParserObj.on('HEARTBEAT', heartbeat_handler);

// Attach an event handler for any valid MAVLink message - we use this mostly for unknown packet types, console.log and debug messages. 
// the majority of specific responses to specifc messages are not handled in the 'generic' handler, but in specific message handlers for each 
// type of message.   eg mavlinkParser1.on('HEATBEAT') is better than here, as this 'generic' block might go away at some point.
var generic_message_handler = function(message) {
    //console.log(message); //BUZZ uncomment to see fully parsed arriving packets in all their glory

    // don't dissplay or handle parsing errors -  ie Bad prefix errors, but allow signing errors thru
    if ((message._id == -1 ) && (message._reason != 'Invalid signature') ) { return;}

    // untargeted packets..   todo
    if (message.target_system == 0 ) { }

    // for packets arriving in from a --out target, their target sysid is NOT us...
    if ((message.target_system < 250 ) && (message.target_system != 0) )  { 
        /*console.log('--out sending:',message._name); */
         mpo.send(message);   
    } 

    // record src system's ID's so we know where to reply to later - only supports one sysid right now. buzz todo
    if( message._header.srcSystem != 255 ) {
        SYSID = message._header.srcSystem;
        COMPID =  message._header.srcComponent??null;
        mpo.srcSystem = SYSID; 
        mpo.srcComponent = COMPID;
    }
    // = 

    // console.log all the uncommon message types we DONT list here. 
    if ( ! ['GPS_RAW_INT', 'VFR_HUD', 'ATTITUDE', 'SYS_STATUS', 'GLOBAL_POSITION_INT', 'HEARTBEAT','VIBRATION',
            'BATTERY_STATUS', 'TERRAIN_REPORT', 'WIND', 'HWSTATUS', 'AHRS', 'AHRS2', 'AHRS3',
            'SIMSTATE', 'RC_CHANNELS','RC_CHANNELS_RAW', 'SERVO_OUTPUT_RAW', 'LOCAL_POSITION_NED',
            'MEMINFO',  'POWER_STATUS', 'SCALED_PRESSURE','SCALED_PRESSURE2', 'SCALED_IMU','SCALED_IMU2','SCALED_IMU3', 'RAW_IMU',
            'EKF_STATUS_REPORT', 'SYSTEM_TIME', 'MISSION_CURRENT' , 'SENSOR_OFFSETS', 
            'TIMESYNC',  'HOME_POSITION', 'POSITION_TARGET_GLOBAL_INT',
            'NAV_CONTROLLER_OUTPUT', 'STATUSTEXT' , 'COMMAND_ACK' , 
            'MISSION_ITEM', 'MISSION_ITEM_INT','MISSION_COUNT','MISSION_REQUEST', 'MISSION_ACK',
            'AIRSPEED_AUTOCAL', 'MISSION_ITEM_REACHED' , 'STAT_FLTTIME' ,'AUTOPILOT_VERSION' ,
             'FENCE_STATUS' , 'AOA_SSA' , 'GPS_GLOBAL_ORIGIN', 'TERRAIN_REQUEST', 
            'FILE_TRANSFER_PROTOCOL', 'MOUNT_STATUS','AUTOPILOT_VERSION_REQUEST',
            'REQUEST_DATA_STREAM', 'PARAM_REQUEST_READ', 'COMMAND_LONG', 'PARAM_REQUEST_LIST',
            'SETUP_SIGNING', 'SET_MODE',  'MISSION_REQUEST_INT', 'FILE_TRANSFER_PROTOCOL', 'MISSION_REQUEST_LIST',
            'PARAM_SET', 'PARAM_VALUE',
            'TERRAIN_DATA', 'MAG_CAL_PROGRESS','MAG_CAL_REPORT',
            ].includes(message._name) ) { 
            
	console.log('unhandled msg type - please add it to the list....:');
	console.log(message);  // emit any message type that we don't list above, as we dont know about it...
    } 
    // log PARAM_VALUE differently to exclude common ones like where param_id starts with 'STAT_RUNTIME' etc
    // many of these are emitted on-boot and aren't interesting as 'normal params' 
    if (  ['PARAM_VALUE' ].includes(message._name) ) { 
        if (  message.param_id.startsWith('STAT_RUNTIME') || 
              message.param_id.startsWith('STAT_FLTTIME')  ||
              message.param_id.startsWith('STAT_RESET')  ||
              message.param_id.startsWith('STAT_BOOTCNT')  ||
              message.param_id.startsWith('COMPASS_')  ||
              message.param_id.startsWith('SR0_')  || 
              message.param_id.startsWith('ARSPD_OFFSET')  || 
              message.param_id.startsWith('MIS_TOTAL')  ||

              message.param_id.startsWith('INS_ACC_ID')  || 
              message.param_id.startsWith('INS_ACC2_ID')  || 
              message.param_id.startsWith('INS_ACC3_ID')  || 

              message.param_id.startsWith('INS_GYR_ID')  || 
              message.param_id.startsWith('INS_GYR2_ID')  || 
              message.param_id.startsWith('INS_GYR3_ID')  || 

              message.param_id.startsWith('INS_GYROFFS_X')  || 
              message.param_id.startsWith('INS_GYROFFS_Y')  || 
              message.param_id.startsWith('INS_GYROFFS_Z')  || 
              message.param_id.startsWith('INS_GYR2OFFS_X')  || 
              message.param_id.startsWith('INS_GYR2OFFS_Y')  || 
              message.param_id.startsWith('INS_GYR2OFFS_Z')  || 
              message.param_id.startsWith('INS_GYR3OFFS_X')  || 
              message.param_id.startsWith('INS_GYR3OFFS_Y')  || 
              message.param_id.startsWith('INS_GYR3OFFS_Z')  || 

              message.param_id.startsWith('GND_ALT_OFFSET')  || 
              message.param_id.startsWith('GND_ABS_PRESS')  ){ 
            // pass
        } else { 
       //     console.log(`param fetch ${message.param_id} -> ${message.param_value} ` );
        }
    }

    //   STATUSTEXT handled elsewhere now

    if (  ['COMMAND_ACK' ].includes(message._name) ) {
        console.log(`COMMAND_ACK command= ${message.command} result= ${message.result} `);
    } 


    if (  ['MISSION_ITEM' ].includes(message._name) ) {
        console.log(`MISSION_ITEM command= ${message.command} x= ${message.x} y= ${message.y} z= ${message.z} `);
    } 

    if (  ['MISSION_ITEM_INT' ].includes(message._name) ) {
        //console.log(`MISSION_ITEM_INT seq= ${message.seq} command= ${message.command} x= ${message.x} y= ${message.y} z= ${message.z} `);
        //console.log(message);
    } 

    if (  ['MISSION_COUNT' ].includes(message._name) ) {
       // console.log(`MISSION_COUNT number of mission items:= ${message.count} `); //moved to mavMission.js

    } 

    if (  ['MISSION_REQUEST' ].includes(message._name) ) {
        //console.log(`MISSION_REQUEST recieved `);
    } 

    if (  ['MISSION_ACK' ].includes(message._name) ) {
        //console.log(`MISSION_ACK recieved `);
    } 

    if (  ['MISSION_ITEM_REACHED' ].includes(message._name) ) {
        console.log(`MISSION_ITEM_REACHED recieved num:= ${message.seq} `);
    }

    if (  ['PARAM_VALUE' ].includes(message._name) &&  message.param_id.startsWith('STAT_FLTTIME')){
        mins = parseInt(message.param_value/60,10);
        secs = parseInt(message.param_value%60,10);
        console.log(`TIME IN AIR:  ${mins}min:${secs}secs `);
    }

}

// generic msg handler
mavParserObj.on('message', generic_message_handler);

//mavParserObj.on('message', MSP._dispatch_message_mav); this line is actually after MSP obj at bottom of this file

    
/**
 *
 * @constructor
 */
var MspMessageClass = function () {

    var publicScope = {};

    publicScope.name = null;
    publicScope.code = null;
    publicScope.messageBody = null;
    publicScope.onFinish = null;
    publicScope.onSend = null;
    publicScope.timer = false;
    publicScope.createdOn = new Date().getTime();
    publicScope.sentOn = null;
    publicScope.retryCounter = 5;

    return publicScope;
};

// this class when instantiated becomes dataHandler

/**
 * @typedef {{state: number, message_direction: number, code: number, message_length_expected: number, message_length_received: number, message_buffer: null, message_buffer_uint8_view: null, message_checksum: number, callbacks: Array, packet_error: number, unsupported: number, ledDirectionLetters: [*], ledFunctionLetters: [*], ledBaseFunctionLetters: [*], ledOverlayLetters: [*], last_received_timestamp: null, analog_last_received_timestamp: number, read: MSP.read, send_message: MSP.send_message, promise: MSP.promise, callbacks_cleanup: MSP.callbacks_cleanup, disconnect_cleanup: MSP.disconnect_cleanup}} MSP
 */

// buzz we leave this named as 'MSP' not 'MAVSP' as a lot of code uses that entry 
//  point , its for compat with real lib
//var MAVSP = MSP;
var MSP = {

   // symbols: {
      //  BEGIN: '$'.charCodeAt(0),
      //  PROTO_V1: 'M'.charCodeAt(0),
     //   PROTO_V2: 'X'.charCodeAt(0),
     //   FROM_MWC: '>'.charCodeAt(0),
     //   TO_MWC: '<'.charCodeAt(0),
     //   UNSUPPORTED: '!'.charCodeAt(0),
   // },
    constants:                  {
       // PROTOCOL_V1:                1,
       // PROTOCOL_V2:                2,
        PROTOCOL_MAV2:              3, // buzz
    //    JUMBO_FRAME_MIN_SIZE:       255,
    },
 
    protocolVersion:            3, // this.constants.PROTOCOL_etc
  //  state:                      0, // this.decoder_states.IDLE
    message_direction:          1,
    code:                       0,
    message_length_expected:    0,
    message_length_received:    0,
    message_buffer:             null,
    message_buffer_uint8_view:  null,
    message_checksum:           0,
    callbacks:                  [],
    packet_error:               0,
  //  unsupported:                0,

    ledDirectionLetters:        ['n', 'e', 's', 'w', 'u', 'd'],        // in LSB bit order
    ledFunctionLetters:         ['i', 'w', 'f', 'a', 't', 'r', 'c', 'g', 's', 'b', 'l'], // in LSB bit order
    ledBaseFunctionLetters:     ['c', 'f', 'a', 'l', 's', 'g', 'r'], // in LSB bit
    ledOverlayLetters:          ['t', 'o', 'b', 'n', 'i', 'w'], // in LSB bit

    last_received_timestamp:   null,
    analog_last_received_timestamp: null,

    // 
    read: function (readInfo) {
       // console.log("MSP read serial bytes len:"+JSON.stringify(readInfo.data.byteLength));
        
       var data = new Uint8Array(readInfo.data); // from Buffer to byte array

        // add bytes into mavlink feed here:
        packetlist = mavParserObj.parseBuffer(data); // also 'emits' msg on completion of each packet

        //console.log("data[]="+JSON.stringify(data)); // raw incoming data

        // filter the packets
        function isGood(element, index, array) {
            //console.log("packet:"+JSON.stringify(element._name)); // emits name of each arriving mavlink packet
            return element._id != -1;
        }
        // if there's no readable packets in the byte stream, dont try to iterate over it
        if (packetlist == null ) return;
        var goodpackets = packetlist.filter(isGood);

        //console.log("packets:",packetlist.length,"good:",goodpackets.length)
        //console.log("packet:"+JSON.stringify(packetlist[0])) // just dumps the first one in the list 

        // remote end doesnt know were mavlink2, send em a mavlink2 packet...
        if ( goodpackets.length == 0 ) {
            //this.heartbeat()
            //set_stream_rates(4);// no target sys or comp, guess?
        }

        if (goodpackets[0] == undefined ) return;

        if (this.streamrate == undefined) {
            send_heartbeat_handler(); // throw a heartbeat first, blindly?
            set_stream_rates(4,goodpackets[0]._header.srcSystem,goodpackets[0]._header.srcComponent); 
            this.streamrate = 4; 
            ParamsObj.getAll(); // todo delay this? - this immediately starts param fetch

        }

        // some form of valid mavlink means we can consider ourselves connected as far as the GUI is concerned
        if (CONFIGURATOR.connectionValid == false ) {
            console.log("CONNECTED!");
            CONFIGURATOR.connectionValid = true;
            CONFIG.flightControllerVersion = "0.0.0"; // buss hack to enable PID pidCount in serial_backend.js 
            GUI.allowedTabs = GUI.defaultAllowedTabsWhenConnected.slice();
            onConnect();
        }

        this.last_received_timestamp = Date.now();
    },

    _initialize_read_buffer: function() {
        this.message_buffer = new ArrayBuffer(this.message_length_expected);
        this.message_buffer_uint8_view = new Uint8Array(this.message_buffer);
    },


    //INCOMING packets thru here...
    _dispatch_message_mav: function(pkt) {
        mspHelper.processDataMav(pkt);
    },

    /**
     * @param {MSP} mspData
     */
    putCallback: function (mspData) {
        MSP.callbacks.push(mspData);
    },

    /**
     * @param {number} code
     */
    removeCallback: function (code) {

        for (var i in this.callbacks) {
            if (this.callbacks.hasOwnProperty(i) && this.callbacks[i].code == code) {
                clearTimeout(this.callbacks[i].timer);
                this.callbacks.splice(i, 1);
            }
        }
    },

    // the original MSP spec calls callback_msp AFTER REPLY is recieved,  buzz hack to call it after send ATTEMPT.
    send_message: function (code, data, callback_sent, callback_msp, protocolVersion) {

        // buzz
        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
          }

        // var payloadLength = data && data.length ? data.length : 0;
        // var length;
        // var buffer;
        // var view;
        // var checksum;
        // var ii;

        if (!protocolVersion) {
            protocolVersion = this.protocolVersion = this.constants.PROTOCOL_MAV2;
        }


    // buzz todo map roughly from MSPCodes.code -> to one of the mavlink20.messages.xxxxx such as mavlink20.messages.heartbeat
        // these are all OUTGOING packts from GCS to vehicle.....
    

    switch(code){
        case MSPCodes.MSP_SENSOR_STATUS:
            // buzz todo
            break;
        case MSPCodes.MSPV2_ARDUPILOT_STATUS:

            //heartbeat isn't realy but its sent often enough 
            var heartbeat = new mavlink20.messages.heartbeat(); 
            heartbeat.custom_mode = 963497464; // fieldtype: uint32_t  isarray: False 
            heartbeat.type = 17; // fieldtype: uint8_t  isarray: False 
            heartbeat.autopilot = 84; // fieldtype: uint8_t  isarray: False 
            heartbeat.base_mode = 151; // fieldtype: uint8_t  isarray: False 
            heartbeat.system_status = 218; // fieldtype: uint8_t  isarray: False 
            heartbeat.mavlink_version = 3; // fieldtype: uint8_t  isarray: False 
            mavParserObj.send(heartbeat);

            // buzz todo
            break;
        case MSPCodes.MSP_ACTIVEBOXES:
            // buzz todo
            break;
        case MSPCodes.MSPV2_ARDUPILOT_ANALOG:
            // buzz todo
            break;
        case MSPCodes.MSP_BOXNAMES:
            // buzz todo
            break;
        case MSPCodes.MSP_DATAFLASH_SUMMARY:
            // buzz todo
            break;
        
        // click on config tab...
        case MSPCodes.MSP_BF_CONFIG:
            // buzz todo
            break;
        //
        case MSPCodes.MSP_ATTITUDE:
            // buzz todo
            break;
            
        case MSPCodes.MSP_ALTITUDE: // was 4 graphs on 'Sensors' page
            // buzz todo
            break;
        case MSPCodes.MSP_RAW_IMU: // was 4 graphs on 'Sensors' page
            // buzz todo
            break;

        // buzz todo more
        default:
            console.log("UNHANDLED MSP.send_message:"+getKeyByValue(MSPCodes,code)+" vers:"+protocolVersion)

    }

        function isFunction(functionToCheck) {
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
        }
           
        if (isFunction(callback_msp)) callback_msp();  //buzz hack

        return true;
    },
    promise: function(code, data, protocolVersion) {
        var self = this;
        return new Promise(function(resolve) {
            self.send_message(code, data, false, function(data) {
                resolve(data);
            }, protocolVersion);
        });
    },
    callbacks_cleanup: function () {
        for (var i = 0; i < this.callbacks.length; i++) {
            clearInterval(this.callbacks[i].timer);
        }

        this.callbacks = [];
    },
    disconnect_cleanup: function () {
        //this.state = 0; // reset packet state for "clean" initial entry (this is only required if user hot-disconnects)
        this.packet_error = 0; // reset CRC packet error counter for next session

        this.callbacks_cleanup();
    }
};

mavParserObj.on('message', MSP._dispatch_message_mav);

MSP.SDCARD_STATE_NOT_PRESENT = 0;
MSP.SDCARD_STATE_FATAL       = 1;
MSP.SDCARD_STATE_CARD_INIT   = 2;
MSP.SDCARD_STATE_FS_INIT     = 3;
MSP.SDCARD_STATE_READY       = 4;
