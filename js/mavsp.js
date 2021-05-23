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
    
          mpo.send(heartbeat,255); // we don't know the sysid yet, so 255 as a broadcast ip is ok.
}
    
var set_stream_rates = function(rate,target_system,target_component) {

// mavproxy uses a stream_rate of 4 on its links by default, so we'll just use that...

//target_system, target_component, req_stream_id, req_message_rate, start_stop

    var rsr = new mavlink20.messages.request_data_stream(target_system,target_component,
                                mavlink20.MAV_DATA_STREAM_ALL,rate, 1);

    mpo.send(rsr); 
    console.log('Set Stream Rates =4');
}



    
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
        packetlist = mpo.parseBuffer(data); // also 'emits' msg on completion of each packet

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
            send_heartbeat_handler(); // shrow a heartbeat first, blindly?
            set_stream_rates(4,goodpackets[0]._header.srcSystem,goodpackets[0]._header.srcComponent); 
            this.streamrate = 4; 
        }

        // some form of valid mavlink means we can consider ourselves connected as far as the GUI is concerned
        if (CONFIGURATOR.connectionValid == false ) {
            console.log("CONNECTED!");
            CONFIGURATOR.connectionValid = true;
            CONFIG.flightControllerVersion = "2.5.0"; // buss hack to enable PID pidCount in serial_backend.js 
            GUI.allowedTabs = GUI.defaultAllowedTabsWhenConnected.slice();
            onConnect();
        }

        this.last_received_timestamp = Date.now();
    },

    _initialize_read_buffer: function() {
        this.message_buffer = new ArrayBuffer(this.message_length_expected);
        this.message_buffer_uint8_view = new Uint8Array(this.message_buffer);
    },

    // called after bytes have properly been checksummed and should be a plausible packet.
    _dispatch_message: function(expected_checksum) {
        if (this.message_checksum == expected_checksum) {
            // message received, process
            mspHelper.processData(this);
        } else {
            console.log('code: ' + this.code + ' - crc failed');
            this.packet_error++;
            $('span.packet-error').html(this.packet_error);
        }

        /*
         * Free port
         */
        helper.mspQueue.freeHardLock();

        // Reset variables
        this.message_length_received = 0;
     //   this.state = this.decoder_states.IDLE;
    },

    /**
     *
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
            mpo.send(heartbeat);

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

        // buzz todo more
        default:
            console.log("UNHANDLED MSP.send_message:"+getKeyByValue(MSPCodes,code)+" vers:"+protocolVersion)

    }
                

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

MSP.SDCARD_STATE_NOT_PRESENT = 0;
MSP.SDCARD_STATE_FATAL       = 1;
MSP.SDCARD_STATE_CARD_INIT   = 2;
MSP.SDCARD_STATE_FS_INIT     = 3;
MSP.SDCARD_STATE_READY       = 4;
