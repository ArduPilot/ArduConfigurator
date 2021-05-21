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
        var data = new Uint8Array(readInfo.data);

        // add bytes into mavlink feed here?

        for (var i = 0; i < data.length; i++) { // don't need to do it byte-at-a-time, but fofr now we do


                    packetlist = mpo.parseBuffer(i); // also 'emits' msg on completion of each packet
                    // filter the packets
                    function isGood(element, index, array) {
                    return element._id != -1;
                    }
                    // if there's no readable packets in the byte stream, dont try to iterate over it
                    if (packetlist == null ) return;
                    var goodpackets = packetlist.filter(isGood);
                    console.log("packets:",packetlist.length,"good:",goodpackets.length)
        
                    // remote end doesnt know were mavlink2, send em a mavlink2 packet...
                    if ( goodpackets.length == 0 ) {
                        this.heartbeat()
                        //set_stream_rates(4);// no target sys or comp, guess?
                    }
        
                    if (goodpackets[0] == undefined ) return;
        
                    if (this.streamrate == undefined) {
                        set_stream_rates(4,goodpackets[0]._header.srcSystem,goodpackets[0]._header.srcComponent); 
                        this.streamrate = 4; 
                    }

              //      this._dispatch_message(data[i]);
          
                 //   helper.mspQueue.freeHardLock();
                  //  console.log('Unknown state detected: ' + this.state);
          //  }
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

        console.log("MSP.send_message:"+getKeyByValue(MSPCodes,code)+" vers:"+protocolVersion)

                
    var heartbeat = new mavlink20.messages.heartbeat(); 
    heartbeat.custom_mode = 963497464; // fieldtype: uint32_t  isarray: False 
    heartbeat.type = 17; // fieldtype: uint8_t  isarray: False 
    heartbeat.autopilot = 84; // fieldtype: uint8_t  isarray: False 
    heartbeat.base_mode = 151; // fieldtype: uint8_t  isarray: False 
    heartbeat.system_status = 218; // fieldtype: uint8_t  isarray: False 
    heartbeat.mavlink_version = 3; // fieldtype: uint8_t  isarray: False 


    var buf = heartbeat.pack(mpo); //Buffer

    var abuf = toArrayBuffer(buf); // ArrayBuffer

 
     var message = new MspMessageClass();
         message.code = 1;//code;
         message.messageBody = abuf;
         message.onFinish  = null;//callback_msp;
         message.onSend  = null;//callback_sent;
         /* In case of MSP_REBOOT special procedure is required
          */
         //if (code == MSPCodes.MSP_SET_REBOOT || code == MSPCodes.MSP_EEPROM_WRITE) {
         //    message.retryCounter = 10;
        // }
     helper.mspQueue.put(message);

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
