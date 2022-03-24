//  #!/usr/bin/env node

// This is the backend Node code for ardu-configurator, it handles opening the "app" window, and tcp/udp comms that get forwarded to the 
//  frontend.  
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

var {mavlink20, MAVLink20Processor} = require("./backend/local_modules/mavlink_ardupilotmega_v2.0/mavlink.js"); 

var {SmartSerialLink,SmartUDPInLink,SmartUDPOutLink,SmartTCPLink,mpo} = require("./smartlinks.js");

var mavParserObj = mpo;

//----------------------------------------------------------------------------------
//console.log("LISTENING FOR UDP IN udpin:0.0.0.0:14550")
//mpo.add_link('udpin:0.0.0.0:14550',false); //u-in
//console.log("TRYING TCP TO tcp:localhost:5760 till one of them succeeds")
//mpo.add_link('tcp:localhost:5760'); // to/from sitl

//mpo.add_out('udpout:localhost:14551'); //u-out to mavcontrol, missionplanner etc

//----------------------------------------------------------------------------------

// this function takes INCOMING tcp/udp mavlink in Node backend server (smartlinks.js), and forwards them to the GUI thread.
// Attach an event handler for any valid MAVLink message , this allows us to capture parsed mavlink packets and forward htem to the 'frontend'
var generic_message_handler = function(message) {

    // don't dissplay or handle parsing errors -  ie Bad prefix errors, but allow signing errors thru
    if ((message._id == -1 ) && (message._reason != 'Invalid signature') ) { return;}

    // for packets arriving in from a --out target, their target sysid is NOT us...
    //if (message.target_system < 250 ) { /*console.log('--out sending:',message._name); */ mpo.send(message);   } 

    if (! newWindow) return;// don't try to post to new window till its real.
    

    // push packed into GUI part of the application.... through "postMessage()"   the GUI/frontend app recieves it in main.js window.addEventListener
    //console.log("eep",JSON.stringify(message));
    try {
    newWindow.window.postMessage(JSON.stringify({ 'udpmavlink': true, 'pkt':message }), "*"); //the second parameter specifies the message origin. afaik, this is merely a string and has no effect beyond being there
    } catch (error) {     // if window gets closed, we'll treat it as time to exit as well.
      console.error(error);

      if ( error.message.startsWith('No window with id') ) {
        process.exit();
      }
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }

}

// this function capture/s message FROM the GUI and consumes them in the backend
// 1st type is a 'connectNode' message that the gui sends to say "open this tcp/udp connection"
// 2st type is a 'sendMAV' message that the gui sends to say "this is a mavlink packet that needs sending to tcp/udp outgoing"
// 3st type is a 'disconnectNode' message that the gui sends to say "close this tcp/udp connection"

window.addEventListener('message', function(event) {
  // ignore 'false' silently
  if (event.data == false) return;

  // event.data is JSON-as-string    
  var data = JSON.parse(event.data);  

  //1st type is a 'connectNode' message that the gui sends to say "open this tcp/udp connection"
  if ( data.connectNode) {
      close_all_links();

      //'connectTcporUdp': true, 'ip': $ip , 'port': $port 
      var ip = data.ip;
      var port = data.port;
      var type = data.type;

      console.log("GOT msg from frontend!!!!!!!!!!!!!",event,ip,port,type);

      if ( type == 'udp') {
        mpo.add_link('udpin:'+ip+':'+port,false); // eg 'udpin:0.0.0.0:14550'
      }
      // if ( type == 'udpout') {
      //   mpo.add_link('udpout:'+ip+':'+port); // eg 'udpin:0.0.0.0:14550'
      // }
      if ( type == 'tcp') {
        mpo.add_link('tcp:'+ip+':'+port);   //eg 'tcp:localhost:5760'
      }
  }
   if ( data.disconnectNode) {
     close_all_links(); // overkill, but for now with 1 link active its ok
   }
  if ( data.sendMAV) {  // { 'sendMAV': true, 'pkt': xxxxx }

    //console.log("sendMAV",data);

    //goes thru backend_generic_link_sender in smartlinks.js
    var pkt = JSON.parse(data.pkt);
    var sysid = data.sysid;// unused but avail

    // passing the pkt through JSON causes it to loose its __proto__ attribute, and it's no longer a mavlink2.messages.xxxx, instead its a __object__
    // here we lookup its real class type and tweak it: 
    var msgId = pkt._id;
    var decoder = mavlink20.map[msgId]; // big list of class info by id number
    var m = new decoder.type();   // make a new 'empty' instance of the right class,
    var newpkt = Object.assign(m, pkt);// 'm' is the right type but empty, pkt is the wrong type but has all the data

    newpkt.fromfrontend = true; // debug for buzz to help with routing

    mpo.send(newpkt,sysid); // basically does  a .ZZsend on each of the link_list's that are present.
  }


});

// // Attach the event handler for any valid MAVLink message in either stream, its agnostic at this stage
mavParserObj.on('message', generic_message_handler);


