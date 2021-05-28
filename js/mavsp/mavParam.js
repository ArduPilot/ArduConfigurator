/**
Module for loading/saving sets of mavlink parameters.
This is a Javascript translation from the mavlink/pymavlink/mavparm.py script in the main mavlink repository.

To deal with this in an async/nonblocking way gracefully, we do this in terms of expecting acks:

1- GCS sends param set request
2- The expected ack is added to an array of outstanding acks
3 - And event bound a single time to the PARAM_VALUE message will unset any matching param_ids
4- when the event is sent, after (retries) attempts, it throws an error
TBD make #4 work

**/
//var _ = require('underscore'),
//    mavlink = require("../mav_v2.js");

// Logger, passed in object constructor for common logging
var log;

// Hash of pending-expected acks
var pendingAcks = {};

// hash of fetched_params indexed by param name as string
var param_table = {};

// Hash of handlers monitoring async send/receive pairs
var senderHandler = {};

// Hash of timers watching for timeouts on ongoing send/receive pairs
var timeoutWatcher = {};

// Reference to the active mavlink parser/link object in use
var mavlinkParser;

// HAND OVER HTE LOT WHEN DONE
MavParam.prototype.get_param_table = function () {
    return param_table;
}


MavParam.prototype.show_fetched_params = function (pattern) {
    console.log(param_table);
    if (pattern != undefined) console.log("showing params containing:",pattern);
    if (pattern == undefined) console.log("showing all params:");
    for ( x in param_table ){
        if  ((pattern != undefined) && (x.includes(pattern)) ) {
            console.log(x, param_table[x]['param_value'])
        } else if (pattern == undefined) {
            console.log(x, param_table[x]['param_value'])
        }
    }
}

// Function that globallby binds to parameter-managing events and handles them as required
function paramHandler(msg) {
    // Unset any pending incoming parameter request for the specitifed param ID.
    // There's some risk that this could get tangled if unrelated code
    // is asking for + setting the same param around the same time, but it
    // seems unlikely.
    if(pendingAcks[msg.param_id]) {
        delete pendingAcks[msg.param_id];
    }
    // FS_OPTIONS\u0000\u0000\u0000\u0000\u0000\u0000'
    var terminator_idx = msg.param_id.indexOf('\u0000') // null string terminator
    var idx = msg.param_id.substring(0,terminator_idx);
    //console.log("param response:",msg.param_id);
    process.stdout.write('^');
    param_table[idx] =  {   'param_value':msg.param_value,  'param_type':msg.param_type,  'param_count':msg.param_count,  'param_index':msg.param_index , 'ts':Date.now()};
    // ts = number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.

}

// Log object is assumed to be a winston object.
function MavParam(target_system,target_component,mavlinkParserObject, logger) {
    
    log = logger;
    mavlinkParser = mavlinkParserObject;
    mavlinkParser.on('PARAM_VALUE', paramHandler);

    this.target_system = target_system; 
    this.target_component = target_component; 

}

// name = param_name
// value = value to send it
MavParam.prototype.set = function(name, value, retries) {
    
    // Set default value of 3 seconds -- TODO figure out if this is ever used in practice in the Python MAVProxy code?
    retries = typeof retries !== 'undefined' ? retries : 3000;

    // Build PARAM_SET message to send 
    var param_set = new mavlink20.messages.param_set(mavlinkParser.srcSystem, mavlinkParser.srcComponent, name, value, 0); // extra zero = don't care about type

    // Establish a handler to try and send the required packet every second until cancelled
    senderHandler[name] = setInterval( function() {
        log.info('Requesting parameter ['+name+'] be set to ['+value+']...');
        mavlinkParser.send(param_set);
    }, 1000);

    timeoutWatcher[name] = setTimeout(function() {
        clearInterval(senderHandler[name]);
        if(pendingAcks[name]) {
            delete pendingAcks[msg.name];
            throw 'No ack returned when requesting to set param ['+name+'] to ['+value+']';
        }
        
    }, retries);
}

MavParam.prototype.get = function(name) {
    var index = -1; // this will use the name as the lookup method
  //  var param_request_read = //new mavlink20.messages.param_request_read(mavlinkParser.srcSystem, mavlinkParser.srcComponent, name, index);


 var param_request_read = new mavlink20.messages.param_request_read(); 
      param_request_read.param_index = (new Int16Array([-1]))[0]; // fieldtype: int16_t  isarray: False 
      param_request_read.target_system = this.target_system // fieldtype: uint8_t  isarray: False 
      param_request_read.target_component = this.target_component; // fieldtype: uint8_t  isarray: False 
      param_request_read.param_id = name;//"EFGHIJKLMNOPQRS"; // fieldtype: char  isarray: False 

    console.log("param_request_read");

    mavlinkParser.send(param_request_read);
};

MavParam.prototype.getAll = function() {
    var param_request_list = new mavlink20.messages.param_request_list();
      param_request_list.target_system = 1; // fieldtype: uint8_t  isarray: False 
      param_request_list.target_component = 0; // fieldtype: uint8_t  isarray: False 

    console.log("param_request_list");

    mavlinkParser.send(param_request_list);
};


/*
 
    def show(self, wildcard='*'):
        '''show parameters'''
        k = sorted(self.keys())
        for p in k:
            if fnmatch.fnmatch(str(p).upper(), wildcard.upper()):
                print("%-16.16s %f" % (str(p), self.get(p)))


*/
//module.exports = MavParam;
