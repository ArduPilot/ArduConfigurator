//var util = require('util');

//	_ = require('underscore');

// Private references to shared resources
//var uavConnection;
//var log;

//https://mavlink.io/en/messages/common.html#MAV_TYPE
// we'll get enough to identify if its a copter-ish or plane-ish thing...
//MAV_TYPE
//mavlink20.MAV_TYPE_FIXED_WING = 1 // Fixed wing aircraft.
//mavlink20.MAV_TYPE_QUADROTOR = 2 // Quadrotor

var mode_mapping_apm = {
    0 : 'MANUAL',
    1 : 'CIRCLE',
    2 : 'STABILIZE',
    3 : 'TRAINING',
    4 : 'ACRO',
    5 : 'FBWA',
    6 : 'FBWB',
    7 : 'CRUISE',
    8 : 'AUTOTUNE',
    10 : 'AUTO',
    11 : 'RTL',
    12 : 'LOITER',
    14 : 'LAND',
    15 : 'GUIDED',
    16 : 'INITIALISING',
    17 : 'QSTABILIZE',
    18 : 'QHOVER',
    19 : 'QLOITER',
    20 : 'QLAND',
    21 : 'QRTL',
    22 : 'QAUTOTUNE',
    };

var mode_mapping_acm = {
    0 : 'STABILIZE',
    1 : 'ACRO',
    2 : 'ALT_HOLD',
    3 : 'AUTO',
    4 : 'GUIDED',
    5 : 'LOITER',
    6 : 'RTL',
    7 : 'CIRCLE',
    8 : 'POSITION',
    9 : 'LAND',
    10 : 'OF_LOITER',
    11 : 'DRIFT',
    13 : 'SPORT',
    14 : 'FLIP',
    15 : 'AUTOTUNE',
    16 : 'POSHOLD',
    17 : 'BRAKE',
    18 : 'THROW',
    19 : 'AVOID_ADSB',
    20 : 'GUIDED_NOGPS',
    21 : 'SMART_RTL',
    22 : 'FLOWHOLD',
    23 : 'FOLLOW',
};


function MavFlightMode(mavlinkObject, mavlinkParserObject, uavConnectionObject, logger,passed_sysid) {
    //console.log(JSON.stringify(mavlinkObject));
	//mavlink = mavlinkObject;
	//mavlinkParser = mavlinkParserObject;
	uavConnection = uavConnectionObject;
	log = logger;
    this.sysid = passed_sysid;
    this.state = {};
    this.newState = {};
	this.attachHandlers(passed_sysid,mavlinkObject,mavlinkParserObject); // handler only wants this sysid data
    this.v = mavlinkObject.WIRE_PROTOCOL_VERSION; // = "1.0";
    //console.log(`MavFlightMode is looking for mode/arming changes with sysid: ${this.sysid} and mav type ${this.v}`);
}

//util.inherits(MavFlightMode, events.EventEmitter); //node
inherits(MavFlightMode, EventEmitter);  // front-end


MavFlightMode.prototype.attachHandlers = function(sysid,mavlink,mavlinkParser) {
        var self = this; // self= MavFlightMode object, we do NOT use 'this' inside the below .on(..) caklback as it's the parser

        //mavlinkParser.on('HEARTBEAT', _.debounce(function(heartbeat) {
        mavlinkParser.on('HEARTBEAT', function(heartbeat) {

        // else ignore data for other sysids than the one we are interested in.
        if ( heartbeat._header.srcSystem != sysid ) return; 

       
		// Translate the bitfields for use in the client.
        //copter or plane or something else?
        if (heartbeat.type == mavlink20.MAV_TYPE_FIXED_WING ) {
            // arduplane uses packet.custom_mode to index into mode_mapping_apm 
            self.newState.mode = mode_mapping_apm[heartbeat.custom_mode]; 
        }
        if (heartbeat.type == mavlink20.MAV_TYPE_QUADROTOR ) {
            // arducopter uses packet.custom_mode to index into mode_mapping_acm 
            self.newState.mode = mode_mapping_acm[heartbeat.custom_mode]; 
        }

        //console.log("ardumode:"+self.newState.mode);
		self.newState.armed = ( mavlink20.MAV_MODE_FLAG_SAFETY_ARMED & heartbeat.base_mode ) ? true : false;		

        if (self.newState.mode != self.state.mode ) {
            self.newState.sysid = self.sysid; // embed self for the callback to know our sysid as well
            console.log(">>>>>>>>>>>>>>>>");
            console.log(self.newState);
            console.log("<<<<<<<<<<<<<<<<");
            self.state.sysid = self.sysid;
            self.state.mode = self.newState.mode;
            self.state.armed = self.newState.armed; // pass arming as a bonus
		    self.emit('modechange', self.state);
		}	
        //report arming state change as well..?
        if (self.newState.armed != self.state.armed ) {
            self.newState.sysid = self.sysid; // embed self for the callback to know our sysid as well
            console.log(">>>>>>>>>>>>>>>>");
            console.log(self.newState);
            console.log("<<<<<<<<<<<<<<<<");
            self.state.sysid = self.sysid;
            self.state.mode = self.newState.mode; // pass mode as a bonus
            self.state.armed = self.newState.armed;
		    self.emit('armingchange', self.state);
		}	
    });

	//}), 1000);
};

MavFlightMode.prototype.getState = function() {
	return this.state;
};

MavFlightMode.prototype.mode_mapping = function() {
	return mode_mapping_apm;
};

MavFlightMode.prototype.mode_mapping_inv = function() {

    var result = {};   // empty object to contain reversed key/value paris
    var keys = Object.keys(mode_mapping_apm);   // first get all keys in an array
    keys.forEach(function(key){
      var val = mode_mapping_apm[key];   // get the value for the current key
      result[val] = key;                 // reverse is done here
    });

	return result;
};

//module.exports = MavFlightMode;
