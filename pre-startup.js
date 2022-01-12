//  #!/usr/bin/env node


// UDP is using mavagent.js's "smartserial.js" almost in its entirety thru this pre-startup.js for arduconfigurator to get UDP data anytime.  
// surprisingly, it seems to kida mostly work 

// the key here is that: NW.js introduces a way to share state between windows or 'contexts', 
//   and Node is the parent/background one.    Even though each window has 
//  its own JavaScript namespace, they all share the same parent Node.js instance and its namespace. This 
//  means you can share state between windows through code that operates on Node.js’ namespace 
//  properties (such as the API methods), including via the require function used to load libraries. 
// If you need to share data between windows in your desktop app, you’ll be able to do this by attaching 
//  data to the global object in your code.

// eg Node/NW globals:
//process.versions['nw']
// Load native UI library
//var gui = require('nw.gui');
//var win = gui.Window.get();
//var win = nw.Window.get();
//var menu = new nw.Menu();

var newWindow; //we declare a global variable to store the handler for our new window

// this means we DONT use node-main in the manifest to actieve the same result, as it would't have this hook
nw.Window.open('main.html', {}, win => { 
  newWindow = win; // save in global for later
  win.showDevTools();
  newWindow.on("loaded", () => {//We only post a message when the new window is ready to listen to events.
      console.log("NW Window loaded...");
        newWindow.window.postMessage(JSON.stringify({ 'udpmavlink': 'true', 'pkt':""}), "*"); //the second parameter specifies the message origin. afaik, this is merely a string and has no effect beyond being there
      //console.log(JSON.stringify(win));
  });
 
});

//
// this is a mavlink UDP listener for ArduPlane style vehicles 
// incoming UDP mavlink/vehicl/sim data at 0.0.0.0:14550 is parsed SERVER SIDE IN NODE.js to generate xxx messages

// mavlink 2 related stuff:

var {mavlink20, MAVLink20Processor} = require("./backend/mavlink_ardupilotmega_v2.0/mavlink.js"); 

var {SmartSerialLink,SmartUDPInLink,SmartUDPOutLink,SmartTCPLink,mpo} = require("./smartlinks.js");

var mavParserObj = mpo;

//----------------------------------------------------------------------------------
console.log("LISTENING FOR UDP IN udpin:0.0.0.0:14550")
mpo.add_link('udpin:0.0.0.0:14550'); //u-in
//console.log("TRYING TCP TO tcp:localhost:5760 till one of them succeeds")
mpo.add_link('tcp:localhost:5760'); // to/from sitl

//mpo.add_out('udpout:localhost:14551'); //u-out to mavcontrol, missionplanner etc

//----------------------------------------------------------------------------------

// Attach an event handler for any valid MAVLink message - we use this mostly for unknown packet types, console.log and debug messages. 
// the majority of specific responses to specifc messages are not handled in the 'generic' handler, but in specific message handlers for each 
// type of message.   eg mavlinkParser1.on('HEATBEAT') is better than here, as this 'generic' block might go away at some point.
var generic_message_handler = function(message) {

    // don't dissplay or handle parsing errors -  ie Bad prefix errors, but allow signing errors thru
    if ((message._id == -1 ) && (message._reason != 'Invalid signature') ) { return;}

    // for packets arriving in from a --out target, their target sysid is NOT us...
    if (message.target_system < 250 ) { /*console.log('--out sending:',message._name); */ mpo.send(message);   } 

    if (! newWindow) return;// don't try to post to new window till its real.

    // push packed into GUI part of the application.... through "postMessage()"   the GUI/frontend app recieves it in main.js window.addEventListener
    //console.log("eep",JSON.stringify(message));
    newWindow.window.postMessage(JSON.stringify({ 'udpmavlink': true, 'pkt':message }), "*"); //the second parameter specifies the message origin. afaik, this is merely a string and has no effect beyond being there

}

// // Attach the event handler for any valid MAVLink message in either stream, its agnostic at this stage
mavParserObj.on('message', generic_message_handler);


