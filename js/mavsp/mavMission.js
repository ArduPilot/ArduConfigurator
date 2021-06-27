/*
Waypoint state manager.
*/
//var _ = require('underscore');

// Logging object (winston)
var log;

// Reference to the mavlink protocol object
var mavlink;

// Reference to the instantiated mavlink object, for access to target system/component.
var mavlinkParser;

// This really needs to not be here.
var uavConnection;



//function missionAckHandler(ack) {
//	log.info('Received mission ack, mission items loaded onto payload.');
//}


// Mapping from numbers (as those stored in waypoint files) to MAVLink commands.
var commandMap;



// Flight plan for the UAF soccer field
var soccerFieldFlight = [
[0,1,0,16,0,0,0,0,64.854843,-147.835846,0.000000,1],
[1,0,3,22,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,30.000000,1],
[2,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854864,-147.838436,30.000000,1],
[3,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854860,-147.837739,30.000000,1],
[4,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854851,-147.837170,30.000000,1],
[5,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854842,-147.836484,30.000000,1],
[6,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855129,-147.836452,30.000000,1],
[7,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855129,-147.837203,30.000000,1],
[8,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855138,-147.837771,30.000000,1],
[9,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855152,-147.838404,30.000000,1],
[10,0,3,20,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1],

];

// Waypoints, an ordered array of waypoint MAVLink objects
//var missionItems = [];

// Mission object constructor
class MavMission {

    constructor(target_system,target_component,mavlinkProtocol, mavlinkProtocolInstance, uavConnectionObject, logger) {
	    log = logger;
	    mavlink = mavlinkProtocol;
	    mavlinkParser = mavlinkProtocolInstance;
	    uavConnection = uavConnectionObject;

        this.target_system = target_system; 
        this.target_component = target_component; 
        this.missionItems = [];
        this.get_enabled = false;// hooks for fetching
        this.send_enabled = false; // hooks for sending
        this.mission_type =  mavlink20.MAV_MISSION_TYPE_MISSION;
        this.send_seq = -1;
        this.fetch_complete = false;
        this.send_complete = false;
    }

}

//util.inherits(MavMission, events.EventEmitter);
inherits(MavMission, EventEmitter);


// Handler when the ArduPilot requests individual waypoints: upon receiving a request,
// Send the next one.
MavMission.prototype.missionRequestHandler = function(missionItemRequest,tt) {
    //console.log("missionRequestHandler",this.missionItems.length);
    //console.log("missionRequestHandler-seq:",missionItemRequest.seq);

    if (tt == 0)    console.log('MISSION_REQUEST <--');
    if (tt == 1)    console.log('MISSION_REQUEST_INT <--');

    if ( this.missionItems[missionItemRequest.seq] ) { 
        // sending new mavlink20.messages.mission_item prepared earlier
        console.log('MISSION_ITEM -->',missionItemRequest.seq);
	    mavlinkParser.send(this.missionItems[missionItemRequest.seq]);
    } else { 
        console.log(`unable to send mission item ${missionItemRequest.seq}, does not exist, skipping`);
    } 
}

// http://qgroundcontrol.org/mavlink/waypoint_protocol
MavMission.prototype.sendToVehicle = function() {

    this.send_complete = false;

    this.enableSendMission()

    console.log('MavMission STARTED SENDING MISSION len:',this.missionItems.length);

	// send mission_count to target, not src
	var missionCount = new mavlink20.messages.mission_count(this.target_system, this.target_component, this.missionItems.length);
    //missionCount.mission_type =  this.mission_type;
        console.log('count mission',missionCount._id,JSON.stringify(missionCount),missionCount);
    console.log('MISSION_COUNT -->');
	mavlinkParser.send(missionCount, uavConnection);


};

// the hooks that need to be in place, at most once, prior to sending...
MavMission.prototype.enableSendMission = function() {

    if (this.send_enabled == true) return;
    this.send_enabled = true;

	// attach mission_request handler back to this object as itself
    var t = this;
	mavlinkParser.on('MISSION_REQUEST', function(msg) { t.missionRequestHandler(msg,0) } );

	mavlinkParser.on('MISSION_REQUEST_INT', function(msg) { t.missionRequestHandler(msg,1) } );
	
	// If the ack is OK, signal OK; if not, signal an error event
	mavlinkParser.on('MISSION_ACK', function(ack) {

        console.log('MISSION_ACK <--');

		if(mavlink20.MAV_MISSION_ACCEPTED === ack.type) {
            console.log('mission:sent to drone');
			//t.emit('mission:sent to drone');
            t.send_complete = true; // t is this
		} else if(mavlink20.MAV_MISSION_INVALID === ack.type) { 
            console.log("invalid mission");
		} else if(mavlink20.MAV_MISSION_ERROR === ack.type) { 
            console.log("invalid mission - not accepting mission commands at all right now");
            //t.send_complete = true;
		} else if(mavlink20.MAV_MISSION_INVALID_SEQUENCE === ack.type) { 
            console.log("invalid sequence");
		} else {
            console.log(ack);
			//throw new Error('Unexpected mission acknowledgement received in mavMission.js');
			console.log('Unexpected mission acknowledgement received in mavMission.js');
        }
	});

};

// http://qgroundcontrol.org/mavlink/waypoint_protocol
// must call enableGetMission at least once before this.
// note that this does NOT wait  for the mission to be got.... it just sends initiating trigger and hopes...
MavMission.prototype.getFromVehicle = function() {

    this.enableGetMission(); // can be called too many times, thats fine.

    // clear local cache before attempting get
    this.missionItems = [];
    this.fetch_complete = false;

    console.log('MavMission getFromVehicle triggered ok. len:',this.missionItems.length);

	// send mission_request_list to target. params: target_system, target_component, mission_type
	var missionRL = new mavlink20.messages.mission_request_list(
                            this.target_system, this.target_component, this.mission_type );
    console.log('MISSION_REQUEST_LIST ->');
	mavlinkParser.send(missionRL, uavConnection);

};

// Handler when the ArduPilot requests individual waypoints: upon receiving a request,
// Send the next one.
MavMission.prototype.missionCountHandler = function(missionCount) {

    console.log(`MISSION_COUNT <-- from drone:= ${missionCount.count} `);

    // no mission in drone
    if (missionCount.count == 0) {  this.missionItems = []; this.fetch_complete = true; return;} 

    // just resize array up if needed
    this.missionItems[missionCount.count-1] = 'last';

    this.fetch_complete = false;

     //console.log('fetchMission-start');
     //console.log(this.missionItems[missionCount.count-1]);

    // need to progressively request them by sequence, after getting the 'count', we ask for the zero'd one to start with:
    // send a MISSION_REQUEST_INT
    this.send_seq = 0;
    var mri = new mavlink20.messages.mission_request_int(this.target_system, this.target_component, this.send_seq, this.mission_type);
    //console.log('request mission item=0',mri.seq,JSON.stringify(mri));
    console.log('MISSION_REQUEST_INT ->');
    this.send_timout = Date.now(); //returns the number of milliseconds elapsed since January 1, 1970
	mavlinkParser.send(mri, uavConnection);
}
// Handler when the ArduPilot requests individual waypoints: upon receiving a request,
// Send the next one.
MavMission.prototype.missionItemHandler = function(missionItem,tt) {


    if (tt == 0)    console.log('MISSION_ITEM <--',missionItem.seq);
    if (tt == 1)    console.log('MISSION_ITEM_INT <-- ',missionItem.seq);

    if ( this.missionItems[missionItem.seq] == 'last' ) { 
        //console.log('fetchMission-end');
        //console.log(this.missionItems[missionItem.seq]);
        console.log(`MISSION fetch completed from drone:= ${this.missionItems.length} items `);
        this.fetch_complete = true;
    }

    // we store them in memory in this.missionItems array.
    this.missionItems[missionItem.seq] =  missionItem;

    // dont ask for another one if it was the last.
    if ( this.fetch_complete == true ) { 
        
        // just send a find MISSION_ACK back to say thanks and that we r done.
        //target_system, target_component, type, mission_type
        var mack = new mavlink20.messages.mission_ack(this.target_system, this.target_component, 
                            mavlink20.MAV_MISSION_ACCEPTED, this.mission_type);
        //console.log('mission ack',mack.seq,JSON.stringify(mack));
        console.log('MISSION_ACK ->');
        this.send_timout = Date.now(); //returns the number of milliseconds elapsed since January 1, 1970
	    mavlinkParser.send(mack, uavConnection);

        return; // and done.
    }

 
    // need to progressively request them by sequence, after getting the 'count', we ask for the zero'd one to start with:
    // send a MISSION_REQUEST_INT
    this.send_seq++;
    var mri = new mavlink20.messages.mission_request_int(this.target_system, this.target_component, this.send_seq, this.mission_type);
    //console.log('request mission item+1',mri.seq,JSON.stringify(mri));
    console.log('MISSION_REQUEST_INT ->');
    this.send_timout = Date.now(); //returns the number of milliseconds elapsed since January 1, 1970
	mavlinkParser.send(mri, uavConnection);
}

MavMission.prototype.timeouthandler = function(missionItem) {

    // milliseconds > 250, retry
    if (( Date.now() - this.send_timout ) > 250 ){

    //console.log('tt');

   // var mri = new mavlink20.messages.mission_request_int(this.target_system, this.target_component, this.send_seq, this.mission_type);
   // this.send_timout = Date.now(); //returns the number of milliseconds elapsed since January 1, 1970
//	mavlinkParser.send(mri, uavConnection);
    }

}


MavMission.prototype.enableGetMission = function() {

    if (this.get_enabled == true) return;
    this.get_enabled = true;

//MISSION_COUNT number of mission items:= 19 
//MISSION_ITEM_INT seq= 0 command= 16 x= -273917174 y= 1524642186 z= 104.0999984741211

        console.log('attached mission item handlers');

    // thse are the incoming packets fro mteh dron that we are listening for during download to gcs from drone.

	// attach mission_request handler, let it cook
    var t = this;
	mavlinkParser.on('MISSION_COUNT', function(msg) { t.missionCountHandler(msg) } ); 

	// attach mission_request handler, let it cook - we'll listen for both, despite only needing one
    var tt = this;
	mavlinkParser.on('MISSION_ITEM_INT', function(msg) { tt.missionItemHandler(msg,1) } );
    var tt = this;
	mavlinkParser.on('MISSION_ITEM', function(msg) { tt.missionItemHandler(msg,0) } );


    // also enable a 4hz idle tomer to handle timeouts on msges
     var ttt = this;
     this.timeoutchecker_interval = setInterval(function(){ // cant use 'this' inside this call, we're talking to the instance.
          ttt.timeouthandler(); 
        },250);


}

// MissionItemMessage is a MAVLink MessageItem object
MavMission.prototype.addMissionItem = function(missionItemMessage) {
	if( _.isUndefined(missionItemMessage)) {
		//throw new Error('Undefined message item in MavMission.addMissionItem!');
		console.log('Undefined message item in MavMission.addMissionItem!');
	}
	this.missionItems[missionItemMessage.seq] = missionItemMessage;
};

MavMission.prototype.clearMission = function(first_argument) {
	this.missionItems = [];
	var missionClearAll = new mavlink20.messages.mission_clear_all(this.target_system, this.target_component);
        console.log('clear mission list',missionClearAll._id,JSON.stringify(missionClearAll));
	mavlinkParser.send(missionClearAll);

        console.log('clear mission',missionClearAll._id,JSON.stringify(missionClearAll));
};


// get mission from drone to local variables., could be written to file after that or displayed etc.
MavMission.prototype.DroneToMission = async function(filename) {
    var self = this;

    await this.getFromVehicle()

    // waits for a number of ms as an async, so non-blocking when used properly
    function setTimeoutPromise(delay) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), delay);
        });
    }

    //todo better error handling
    this.attempts = 0;
    const resolves_after_mission_fetched = async () => { 
          while (1) { 
                console.log("this.fetch_complete",this.fetch_complete);
                self.attempts++;
                if (self.attempts >= 100 ) return false;  // 100 attempts at 10-per-sec = ~10 secs timeout
                if (self.fetch_complete == true ) return true; 
                await setTimeoutPromise(100); // 100ms or 10 times per sec, we recheck the boolean
          } 
    }

    const fetched_yet = await resolves_after_mission_fetched();

    console.log("MISSION FETCHED?",fetched_yet);// this happens after mission completely fetched


    if (fetched_yet) {
        fs = require('fs').promises;
        //var data = JSON.stringify(this.missionItems); // quick write as json.
        //await fs.writeFile(filename, data);

        // write as mission format compatible with this script for cut-n-paste 
        var data2 = 'window.missionItems = [\n';
	    _.each(this.missionItems, function(e, i, l) {

                //console.log(e);

			    var l = [e.seq, // 0
			    e.current,  //1
			    e.frame,  //2
			    e.command, //3
			    e.param1, //4
			    e.param2, //5
			    e.param3, //6
			    e.param4, //7
			    e.x,///10000000,    //8
			    e.y,///10000000,    //9
			    e.z,  //10
			    e.autocontinue]; //11

                data2 += "[";
                data2 += l.toString();
                data2 += "],\n";

                var wp_type = MWNP.WPTYPE.WAYPOINT;
                //if ( e.command == 16 ) wp_type = MWNP.WPTYPE.WAYPOINT; // The scheduled action for the waypoint.

                // skip 'home' = 'zero' wp from drone
                if ( e.seq != 0 ) {
                    //number, action, lat, lon, alt=0, p1=0, p2=0, p3=0, endMission=0, isUsed=true, isAttached=false, attachedId=""
                    MISSION_PLANER.put(new Waypoint(
                        e.seq,//data.getUint8(0),//number
                        wp_type,//data.getUint8(1),       //action like MWNP.WPTYPE.JUMP  or MWNP.WPTYPE.WAYPOINT
                        e.x*10000000,//data.getInt32(2, true), //lat
                        e.y*10000000,//data.getInt32(6, true), //lon
                        e.z,//data.getInt32(10, true), //alt
                        e.param1,//data.getInt16(14, true), //p1 
                        e.param2,//data.getInt16(16, true), //p2 
                        e.param3,//data.getInt16(18, true)  //p3
                        // eep buzz todo, fit e.param4 
                    ));
                }
                //
        });
        data2 += '];\n//module.exports = missionItems;\n';
        await fs.writeFile(filename, data2);
        
        console.log("MISSION FILE WRITTEN:",filename);// this happens after file written
    }

}

// convert them to items, and send them...  'miss' comes from var miss = require("./gotmission.txt.js");
MavMission.prototype.MissionToDrone = async function(miss) {
    var self = this;

    // clear the internal list
    this.missionItems = [];

    // fallback to the default/demo mission
    if (miss == undefined ) { console.log("MISSION - sending default/demo mission as no number given."); miss = soccerFieldFlight;   }

    
this.enableGetMission(); // can be called too many times, thats fine.

	_.each(miss, function(e, i, l) {

        // minimal validation here, but this is a good start..
        if ( e[3] < mavlink20.MAV_CMD_NAV_WAYPOINT ) e[3] = mavlink20.MAV_CMD_NAV_WAYPOINT; //min is 16
  
		// target_system, target_component, seq, frame, command, current, autocontinue, param1, param2, param3, param4, x, y, z
		mi = new mavlink20.messages.mission_item(
			1,  //tgtsysid
			1,  //tgtcompid
			e[0],    // seq
			e[2],    // frame
			e[3],    // command
			e[1],    // current
			e[11],   // autocontinue
			e[4],  // param1,
			e[5],  // param2,
			e[6],  // param3
			e[7],  // param4
			e[8],//*10000000,  // x (latitude
			e[9],//*10000000,  // y (longitude
			e[10],  // z (altitude
		);

	self.missionItems[mi.seq] = mi;

      //console.log('prepping mission item',mi.seq);
	});

      console.log('prepping mission-items',this.missionItems.length);

	await this.sendToVehicle();	


    // waits for a number of ms as an async, so non-blocking when used properly
    function setTimeoutPromise(delay) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), delay);
        });
    }

    //todo better error handling
    this.attempts = 0;
    const resolves_after_mission_sent = async () => { 
          while (1) { 
                //console.log("this.send_complete",this.send_complete);
                self.attempts++;
                if (self.attempts >= 100 ) return false;  // 100 attempts at 10-per-sec = ~10 secs timeout
                if (self.send_complete == true ) return true; 
                await setTimeoutPromise(100); // 100ms or 10 times per sec, we recheck the boolean
          } 
    }

    const sent_yet = await resolves_after_mission_sent();

    console.log("MISSION SENT?",sent_yet);// this happens after mission completely fetched


    //console.log(this.missionItems);
};

MavMission.prototype.getMissionItems = function() {
	return this.missionItems;
}

//[0] = seq
//[1] = current = 0/1
//[2] = frame = mavlink20.MAV_FRAME_GLOBAL = 0, mavlink20.MAV_FRAME_GLOBAL_RELATIVE_ALT = 3, etc
//[3] = command = 'the scheduled action for the waypoint' = mavlink20.MAV_CMD_*  , zero not allowed, default=16 = regular waypoint

// Flight plan for the UAF soccer field
var soccerFieldFlight = [
[0,1,0,16,0,0,0,0,64.854843,-147.835846,0.000000,1], //0=home
[1,0,3,22,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,30.000000,1],
[2,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854864,-147.838436,30.000000,1],
[3,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854860,-147.837739,30.000000,1],
[4,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854851,-147.837170,30.000000,1],
[5,0,3,16,0.000000,0.000000,0.000000,0.000000,64.854842,-147.836484,30.000000,1],
[6,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855129,-147.836452,30.000000,1],
[7,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855129,-147.837203,30.000000,1],
[8,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855138,-147.837771,30.000000,1],
[9,0,3,16,0.000000,0.000000,0.000000,0.000000,64.855152,-147.838404,30.000000,1],
[10,0,3,20,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,0.000000,1],

];

// Shim for testing mission
var missionItemsTesting = [
[0,1,3,0,0.000000,0.000000,0.000000,0.000000,-35.362881,149.165222,582.000000,1],//0=home
[1,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.362324,149.164291,120.000000,1],
[2,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.363670,149.164505,120.000000,1],
[3,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.362358,149.163651,120.000000,1],
[4,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.363777,149.163895,120.000000,1],
[5,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.362411,149.163071,120.000000,1],
[6,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.363865,149.163223,120.000000,1],
[7,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.362431,149.162384,120.000000,1],
[8,0,3,16,0.000000,0.000000,0.000000,0.000000,-35.363968,149.162567,120.000000,1],
[9,0,3,20,0.000000,0.000000,0.000000,0.000000,-35.363228,149.161896,30.000000,1]
];

// Another shim for testing quadcopter
var missionItemsQuadTesting = [
//QGC,WPL,110
//s,fr,ac,cmd,p1,p2,p3,p4,lat,lon,alt,continue
[0,1,3,16,0.000000,0.000000,0.000000,0.000000,-35.362881,149.165222,582,1],

//,takeoff
[1,0,3,22,0.000000,0.000000,0.000000,0.000000,-35.362881,149.165222,20,1],

//,MAV_CMD_NAV_WAYPOINT,A
//,Hold,sec,Hit,rad,empty,Yaw,angle,lat,lon,alt,continue
[2,0,3,16,0,3,0,0,-35.363949,149.164151,20,1],

//,MAV_CMD_CONDITION_YAW
//,delta,deg,sec,Dir,1=CW,Rel/Abs,Lat,lon,Alt,continue
[3,0,3,115,640,20,1,1,0,0,0,1],

//,MAV_CMD_NAV_LOITER_TIME
//,seconds,empty,rad,Yaw,per,Lat,lon,Alt,continue
[4,0,3,19,35,0,0,1,0,0,20,1],

//,MAV_CMD_NAV_WAYPOINT,B
//,Hold,sec,Hit,rad,empty,Yaw,angle,lat,lon,alt,continue
[5,0,3,16,0,3,0,0,-35.363287,149.164958,20,1],

//,MAV_CMD_NAV_LOITER_TURNS
//,Turns,lat,lon,alt,continue
//6,0,3,18,2,0,0,0,0,0,20,1

//,MAV_CMD_DO_SET_ROI,,MAV_ROI_WPNEXT,=,1
//,MAV_ROI,WP,index,ROI,index,lat,lon,alt,continue
[7,0,3,201,1,0,0,0,0,0,0,1],

//,MAV_CMD_NAV_WAYPOINT,C
//,Hold,sec,Hit,rad,empty,Yaw,angle,lat,lon,alt,continue
[8,0,3,16,0,3,0,0,-35.364865,149.164952,20,1],

//,MAV_CMD_CONDITION_DISTANCE
//,meters,continue
[9,0,3,114,100,0,0,0,0,0,0,1],

//,MAV_CMD_CONDITION_CHANGE_ALT
//,climb_rate,alt,continue
[10,0,3,113,0,0,0,0,0,0,40,1],

//,MAV_CMD_NAV_WAYPOINT,D
//,Hold,sec,Hit,rad,empty,Yaw,angle,lat,lon,alt,continue
[11,0,3,16,0,3,0,0,-35.363165,149.163905,20,1],

//,MAV_CMD_NAV_WAYPOINT,E
//,Hold,sec,Hit,rad,empty,Yaw,angle,lat,lon,alt,continue
[12,0,3,16,0,3,0,0,-35.363611,149.163583,20,1],

//,MAV_CMD_DO_JUMP
//,seq//,repeat,.,.,.,.,.,continue
[13,0,3,177,11,3,0,0,0,0,0,1],

//,MAV_CMD_NAV_RETURN_TO_LAUNCH
//,.,.,.,.,alt,continue
[14,0,3,20,0,0,0,0,0,0,20,1],

//,MAV_CMD_NAV_LAND
//
[15,0,3,21,0,0,0,0,0,0,0,1],

//,WP_total,=,10
//,0,=,home

//,seq
//,current
//,frame
//,command
//,param1,
//,param2,
//,param3
//,param4
//,x,(latitude)
//,y,(longitude)
//,z,(altitude)
//,autocontinue

];

// Static placeholder for a mission to test

/*
# seq
# frame
# action
# current
# autocontinue
 # param1,
 # param2,
 # param3
 # param4
 # x, latitude
 # y, longitude
  # z
  */

//module.exports = MavMission;
