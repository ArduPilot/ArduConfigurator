//-------------------------------------------------------------
//
//const SerialPort = require('serialport')
const SerialPort = require("chrome-apps-serialport").SerialPort;


// we get object types, but don't instantiate here.
//var {mavlink20, MAVLink20Processor} = require("./mav_v2.js"); 
var {mavlink20, MAVLink20Processor} = require("./backend/local_modules/mavlink_ardupilotmega_v2.0/mavlink.js"); 


var broadcast_ip_address = {'ip':'127.0.0.1', 'port':'something', 'type':'else' }; 
var sysid_to_ip_address = {};

var link_list = [];  // a list of instantiated Smart*Link objs to drone

var out_list = [];  // a list of instantiated Smart*Link objs to other gcs's

var get_broadip_table = function() { return broadcast_ip_address; }
var get_sys_to_ip_table = function() { return sysid_to_ip_address; }


// either 'serial' or 'udpin' or 'serial:/dev/ttyACM0', or 'udpin:irrelevant:port' or 'udpout:1.2.3.4:port'
// for serial, there's at most 2 parts ':' separated
// for tcp and/or udp, there MUST be three parts ':' separated xxx:host:port
add_link = function(thingname) {
    console.log("opening LINK:",thingname);
    var words = thingname.split(':'); 
    if (words[0] == 'serial')  link_list.push(new SmartSerialLink(words[1]));
    if (words[0]  == 'tcp')    link_list.push(new SmartTCPLink(words[1],words[2]));
    if (words[0]  == 'udpin')  link_list.push(new SmartUDPInLink(words[2]));
    if (words[0]  == 'udpout') link_list.push(new SmartUDPOutLink(words[1],words[2]));

}

close_all_links = function() {
    for ( l in link_list){
        var lll= link_list[l];
        console.log("closing LINK:",lll);
        //lll.end(); // 1/2 closes by sending send FIN pkt and waitin for remote server to also send FIN back, which might trigger socket.on('close',...)
        lll.destroy(); /// aggressive and not polite
    }
    link_list = [];
}

add_out = function(thingname) {
    console.log("opening OUT: ",thingname);
    var words = thingname.split(':'); 
    if (words[0] == 'serial')  out_list.push(new SmartSerialLink(words[1],true));
    if (words[0]  == 'tcp')    out_list.push(new SmartTCPLink(words[1],words[2],true));
    if (words[0]  == 'udpin')  out_list.push(new SmartUDPInLink(words[2]),true);
    if (words[0]  == 'udpout') out_list.push(new SmartUDPOutLink(words[1],words[2],true));

}

close_all_outs = function() {
    for ( o in out_list){
        var ooo= out_list[o];
        console.log("closing OUT: ",ooo);
        //ooo.end(); // 1/2 closes by sending send FIN pkt and waitin for remote server to also send FIN back, which might trigger socket.on('close',...)
        ooo.destroy(); /// aggressive and not polite
    }
    out_list = [];
}

// create the output hooks for the parser/s
// we overwrite the default send() instead of overwriting write() or using setConnection(), which don't know the ip or port info.
// and we accept ip/port either as part of the mavmsg object, or as a sysid in the OPTIONAL 2nd parameter
// The sysid in the 2nd param is supposed to help us keep a lookup table of which link the sysid is known to be on and just send to those,
//  but right now we are a bit dumb and just send it to all of the links
// inside the context of this function, 'this' is the MAVLink20Processor as we called by it as part of send()
backend_generic_link_sender = function(mavmsg,sysid) {
    //console.log("backend send",mavmsg,sysid);

    //console.log("XXXXXXXXXXXXXXXXXX",mavmsg,sysid)
        
    // this is really just part of the original send()
    buf = mavmsg.pack(this);


    // a pretty dumb solution here to try to send it out all active uplinks that are reporting is_connected()
    for ( l in link_list){
        var lll= link_list[l];
        // see if we can work out the target system from sysid or similar?
        if ((! sysid ) && (mavmsg.target_system) ) { sysid = mavmsg.target_system }
        // then see if we cna find a matching ip/port that it came from originially?
        var ip_info = sysid_to_ip_address[sysid];
        // this isn't very smart... it basically says "if it came from a tcp connection, send it to all tcp connections"
        if ( ip_info  &&  lll.smarttype == ip_info.type) {
            if (lll.is_connected()) {
                lll.ZZsend(buf);
                continue; //
            }
        }  
        // if no ip_info, then just spam all the connected links, which is even dumber
        if (lll.is_connected()) {
            lll.ZZsend(buf);
        }
    }

    // this is really just part of the original send()
    this.seq = (this.seq + 1) % 256;
    this.total_packets_sent +=1;
    this.total_bytes_sent += buf.length;
}


generic_out_sender = function(buf) {

   for ( l in out_list){
        var lll= out_list[l];

        //console.log("generic out sender",lll.constructor.name);
        //process.stdout.write('o');

        // if (lll.is_connected()) 
        lll.ZZsend(buf);
    }

}

var logger = null;//console; //winston.createLogger({transports:[new(winston.transports.File)({ filename:'mavlink.dev.log'})]});

//var origsend2 = MAVLink20Processor.prototype.send;
MAVLink20Processor.prototype.send = backend_generic_link_sender;
MAVLink20Processor.prototype.add_link = add_link;
MAVLink20Processor.prototype.add_out = add_out;

var mpo = new MAVLink20Processor(logger, 255,190); // 255 is the mavlink sysid of this code as a GCS, as per mavproxy.

//------------------------------------------------

var spinners = ["-","\\","|","/"];
var spinner = 0;
// tcp_client.   udp_server.  and port.  all come thru here.
var send_heartbeat_handler = function() {
//console.log("hb handler");
   var heartbeat = new mavlink20.messages.heartbeat(); 
      heartbeat.custom_mode = 963497464; // fieldtype: uint32_t  isarray: False 
      heartbeat.type = 17; // fieldtype: uint8_t  isarray: False 
      heartbeat.autopilot = 84; // fieldtype: uint8_t  isarray: False 
      heartbeat.base_mode = 151; // fieldtype: uint8_t  isarray: False 
      heartbeat.system_status = 218; // fieldtype: uint8_t  isarray: False 
      heartbeat.mavlink_version = 3; // fieldtype: uint8_t  isarray: False 

      //todo buzz hack put this back mpo.send(heartbeat,255); // we don't know the sysid yet, so 255 as a broadcast ip is ok.

    //    process.stdout.write("\b"); // move cursor back, but does not clear prev pos
    spinner++;
    spinner = spinner%4;
    process.stdout.write("\b"); // move cursor back, but does not clear prev pos
    process.stdout.write(spinners[spinner]);

}

var set_stream_rates = function(rate,target_system,target_component) {

// mavproxy uses a stream_rate of 4 on its links by default, so we'll just use that...

//target_system, target_component, req_stream_id, req_message_rate, start_stop

    var rsr = new mavlink20.messages.request_data_stream(target_system,target_component,
                                mavlink20.MAV_DATA_STREAM_ALL,rate, 1);

    mpo.send(rsr); 
    console.log('Set Stream Rates =4');
}



class SmartSerialLink extends SerialPort {

    constructor (path, is_output) {

        super(path, { baudRate: 115200, autoOpen: true });
        //this = new SerialPort(path, { baudRate: 115200, autoOpen: true });// its actually a promise till opened

        this.__path=path;
        this.smarttype = 'serial'; // needs to match the 'type': xxxx in sysid_to_ip_address
        this.last_error = undefined;
        this.mavlinktype = undefined;
        this.streamrate = undefined;
        this.is_output = is_output;

        this.ISSERIALCONNECTED = false;

        console.log('[SerialPort] initialised.\n');

        this.eventsetup();


    }

    is_connected() { return this.ISSERIALCONNECTED; }

    destroy () {
        this.close(); //
        this.ISSERIALCONNECTED = false; 
    }

    // serials are sent with the write()
    ZZsend(data) {
        this.write( data ); // already open, we hope
    }
    //https://serialport.io/docs/api-stream reference

    eventsetup() {

        this.on('open',function(){

          this.ISSERIALCONNECTED = true; 

          console.log('Serial: connection opening...');

          // serial, not ip, fake the ip, and use path instead of port
          // we know we can reply here, even without knowing the sysid...
          broadcast_ip_address = {'ip':'127.0.0.1', 'port':this.__path, 'type':'serial' }; 
          send_heartbeat_handler(); // doesnt know sysid, heartbeat is ok, as its a broadcast, so 255

          // writing data to server
          //client.write('hello from client');// we send something so server doesnt drop us

        });

        // uncomment to dump mavlink to screen
        //this.on('data', line => console.log(`> ${line}`))

        this.on('data',function(msg){

            if (this.is_output === undefined ) generic_out_sender(msg); // also forward the packet to all --outputs

            var bread = this.bytesRead;
            var bwrite = this.bytesWritten;
            //console.log('[SerialPort] Bytes read : ' + bread);
            //console.log('[SerialPort] Bytes written : ' + bwrite);
            //console.log('[SerialPort] Data sent FROM serial : ' + data);

            //console.log("SER:",this.is_output,msg); //msg is a Buffer

            //echo data
            //var is_kernel_buffer_full = this.write('Data ::' + msg);
            //if(is_kernel_buffer_full){
            //console.log('[SerialPort] Data was flushed successfully from kernel buffer i.e written successfully!');
            //}else{
            //  this.pause();
            //}

           // var array_of_chars = Uint8Array.from(msg) // from Buffer to byte array
            var packetlist = [];

            if ( (this.mavlinktype == undefined) && msg.includes(254) ) { //fe
            console.log("might be mavlink1..?");
            }

            if ( (this.mavlinktype == undefined) && msg.includes(253) ) { //fd
              console.log("found mavlink2 header-serial");
              this.mavlinktype = 2;
            }
            packetlist = mpo.parseBuffer(msg); // emits msgs
            // filter the packets
            function isGood(element, index, array) {
            return element._id != -1;
            }
            // if there's no readable packets in the byte stream, dont try to iterate over it
            if (packetlist == null ) return;
            var goodpackets = packetlist.filter(isGood);
            //console.log("packets:",packetlist.length,"good:",goodpackets.length)

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

            var rinfo = { address: '127.0.0.1',  port: '/dev/ttyUSB0' }
            if ( goodpackets[0]._header !== undefined ) 
            sysid_to_ip_address[goodpackets[0]._header.srcSystem] = {'ip':rinfo.address, 'port':rinfo.port, 'type':"serial" }; 

        });


        this.on('drain',function(){
          //console.log('[SerialPort] write buffer is empty now .. u can resume the writable stream');
          this.resume();
        });

        this.on('disconnect',function(){
          console.log('[SerialPort] disconnect event');
        });

        // called when a previously valid thing was unplugged...
        this.on('close',function(){
        //console.log('[SerialPort] close event');

            this.last_error = undefined;
            this.mavlinktype = undefined;
            this.streamrate = undefined;

            // we'll treat a close/unplug as an error, both of which need a re-detect loop
            this.emit('error', 'serialport not readable');

        });


        this.on('error',function(error){
            //console.log('[SerialPort] error event');
            if (this.ISUDPINCONNECTED)  {  
                return;
            }
            if (this.ISUDPOUTCONNECTED)  {  
                return;
            }
            if (this.ISTCPCONNECTED)  {  
                //console.log("using incoming SERIAL data, stopped retries on TCP");    
                return;
            }
            this.ISSERIALCONNECTED = false; 

            // don't report same error more than 1hz..
            if (this.last_error != error.toString()) {
              this.last_error = error.toString();
              console.log('[SerialPort] ' + error + " - retrying...");
            }

            // re-instantiate whole object, with autoopen
            //this = new SerialPort(path, { baudRate: 115200, autoOpen: true });// its actually a promise till opened

             this.open();

        });

      // serial-specific
     var ttt = this;
     this.heartbeat_interval = setInterval(function(){ // cant use 'this' inside this call, we're talking to the instance.
          ttt.heartbeat(); // types '>' on console 
          ttt.last_error = undefined;
          if (this.ISSERIALCONNECTED ) show_stream_rates('serial',3)
        },1000);

  }


   // basic checks of tcp link before trying to send
   heartbeat(){
       //console.log("HEARTBEAT");
       if ( ! this.ISSERIALCONNECTED ) return ;
       //don't send unless we are connected, probably dont need all of these..

        send_heartbeat_handler();
    }


}



//-------------------------------------------------------------
const net = require('net');

class SmartTCPLink extends net.Socket {

    constructor (ip,port,is_output) {
        super()

        this.last_error = undefined;
        this.smarttype = 'tcp'; // needs to match the 'type': xxxx in sysid_to_ip_address
        this.remote_ip = ip;//'127.0.0.1';
        this.remote_port = port;//5760;
        this.is_output = is_output;

        this.ISTCPCONNECTED = false; 

        this.connect({
          host:this.remote_ip,
          port:this.remote_port
        });

        this.eventsetup();

    }

    // tip, as we inherit from net.Socket 'destroy()' already works in parent class
    destroy() {
   
        super.end(); //Half-closes the socket. i.e., it sends a FIN packet
        super.destroy(); 
        this.ISTCPCONNECTED = false; 
        this.on('connect',function(){}); // clear it so we don't get the events 
        this.on('data',function(msg){}); // and here
        this.on('error',function(error){}); // etc
        clearInterval(this.heartbeat_interval); // cancells the 'setInterval' stuff
    }

    is_connected() { return this.ISTCPCONNECTED; }

  // basic checks of tcp link before trying to send
    heartbeat() {
       //don't send unless we are connected, probably dont need all of these..
       if (this.connecting == true ) {return; } // when other end wasnt there to start with
       if (this.readable == false ) {
            //console.log("tcp not readable");
            this.emit('error', 'tcp not readable'); // tell the error handler that will try re-connecting.
            return; 
        }// when other end goes-away unexpectedly
        send_heartbeat_handler();
    }

    // tcp is already open ,we hope.
    ZZsend(data){
        data = new Buffer.from(data)
        this.write( data ); // already open, we hope , immediate net.Socket.write
    }


    eventsetup() {

        this.on('connect',function(){

            this.ISTCPCONNECTED = true; 

            //similar to chrome.sockets.tcp.setNoDelay ...
            this.setNoDelay(); //disable nagle, good for low-latencies.

            console.log('TCPClient: connection established with TCP server');

            console.log('---------client details -----------------');
            var address = this.address();
            var port = address.port;
            var family = address.family;
            var ipaddr = address.address;
            console.log('TCPClient is connected and recieving on local port: ' + port);
            console.log('TCPClient ip :' + ipaddr);
            console.log('TCPClient is IP4/IP6 : ' + family);

            // we know we can reply here, even without knowing the sysid...
            broadcast_ip_address = {'ip':ipaddr, 'port':port, 'type':'tcp' }; 
            //this.send_heartbeat(); // doesnt know sysid, heartbeat is ok, as its a broadcast, so 255

            send_heartbeat_handler();

        });

        // UDPSERVER IS DIFFERENT TO TCP CLIENT BUT SIMILAR>>>
        this.on('data',function(msg){ // msg = a Buffer() of data

             if (this.is_output === undefined ) generic_out_sender(msg); // also forward the packet to all --outputs

            var rinfo = this.address() // return { address: '127.0.0.1', family: 'IPv4', port: 40860 }
            var array_of_chars = Uint8Array.from(msg) // from Buffer to byte array
            var packetlist = [];

            if ( (this.mavlinktype == undefined) && array_of_chars.includes(253) ) {
            console.log("found mavlink2 header-tcp");
            this.mavlinktype = 2;
            }
            packetlist = mpo.parseBuffer(array_of_chars); // emits msgs

            // filter the packets
            function isGood(element, index, array) {
              return element._id != -1;
            }

            // if there's no readable packets in the byte stream, dont try to iterate over it
            if (packetlist == null ) return;
            var goodpackets = packetlist.filter(isGood);


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
            if ( goodpackets[0]._header !== undefined ) 
            sysid_to_ip_address[goodpackets[0]._header.srcSystem] = {'ip':rinfo.address, 'port':rinfo.port, 'type':"tcp" }; 
        });


        // don't report same error more than 1hz..
        // var last_error = undefined;
        this.on('error',function(error){

            // if u have a udp-in conenction, then its ok not to have tcp, so don't complain about it or retry tcp.
            if (this.ISUDPINCONNECTED)   {  return;  }

            // if u have a serial conenction, then its ok not to have tcp, so don't complain about it or retry tcp.
            if (this.ISSERIALCONNECTED)  {  return;  }  // dont tear-down the serial here either

            this.ISTCPCONNECTED = false; 

            if (this.last_error != error.toString()) {
              this.last_error = error.toString();
              //console.log('[TCP Client]' + error + " - retrying...");
            }

            this.connect({
              host:this.remote_ip,
              port:this.remote_port
            });

        });

        // this is a tcp cliebnt heartbeat handler at 1hz, u
        var t= this; //  closure with an explicit reference:
        this.heartbeat_interval = setInterval( function(){
          //console.log('client interval');
          t.heartbeat(); // types '>' on console 
          t.last_error = undefined;
          if (this.ISTCPCONNECTED ) show_stream_rates('client',2)
        },1000);
        // clear with clearInterval(heartbeat_interval)

    }


} // end of SmartTCPLink


//-------------------------------------------------------------
//
// creating a udp server, as its a listener, its a bit different to a serial or tcp_client connection, but works.
//
const dgram = require('dgram');
var buffer = require('buffer');


class SmartUDPOutLink extends dgram.Socket {


    constructor (ip, portnum,is_output) {
        super('udp4')

        this.ISUDPOUTCONNECTED = false; 
        this.smarttype = 'udpout'; // needs to match the 'type': xxxx in sysid_to_ip_address
        this.is_output = is_output;
        this.eventsetup();

       // this = udp.createSocket('udp4');

        this._ip = ip;
        this._portnum = portnum;


      this.ISUDPOUTCONNECTED = true; // in constructor, before sending anything, assume the first send will be ok

      this.probe_connection();
    }

    // on a new-or-not-yet-connected-link, try this to get connected.. its basically send_heartbeat without an is_connected() check.
    probe_connection() {
        // we need to send something up-front to get a response from the remote end... and can't wait for first-incoming packet
        // in this case.
        var message = new mavlink20.messages.heartbeat(); 
        message.custom_mode = 963497464; // fieldtype: uint32_t  isarray: False 
        message.type = 17; // fieldtype: uint8_t  isarray: False 
        message.autopilot = 84; // fieldtype: uint8_t  isarray: False 
        message.base_mode = 151; // fieldtype: uint8_t  isarray: False 
        message.system_status = 218; // fieldtype: uint8_t  isarray: False 
        message.mavlink_version = 3; // fieldtype: uint8_t  isarray: False 

        mpo.send(heartbeat,255); // we don't know the sysid yet, so 255 as a broadcast ip is ok.

        process.stdout.write('#');

        var buffer = new Buffer.from(message.pack(mpo));

        broadcast_ip_address = {'ip':this._ip,'port':this._portnum, 'type':'udpout' }; 
        this.send(buffer,this._portnum,this._ip);

    }

    // matches name used by net.Socket
    destroy() {
        //https://nodejs.org/api/dgram.html#socketdisconnect
        //ERR_SOCKET_DGRAM_NOT_CONNECTED
        try {
        this.disconnect(); //disassociates a connected dgram.Socket from its remote address
        } catch (e) {
            console.log("no-biggie...",e);
        } 
        this.close(); //close the underlying socket and stop listening for data on it. 
        this.ISUDPOUTCONNECTED = false; 

    }

    // udpout
    ZZsend(data){
        data = new Buffer.from(data);
        this.send( data, this._portnum, this._ip  );
    }


    is_connected() { return this.ISUDPOUTCONNECTED; }

    // basic checks of udp link before trying to send
    heartbeat() {
        send_heartbeat_handler();
        if ( ! this.ISUDPOUTCONNECTED ) {console.log("udpout trying to reconnect..."); this.probe_connection();  }
    }


    eventsetup(){


        // hook udp listener events to actions:
        this.on('error', (err) => {
            //this.ISUDPOUTCONNECTED = false; 
            console.log(`udpout error:\n${err.stack}`);
        });

        // this is a upd-server heartbeat handler at 1hz
        var tto = this;
        this.heartbeat_interval = setInterval(function(){
          if (tto != undefined ) tto.heartbeat(); // types '>' on console 
          //if (serialport != undefined ) serialport.send_heartbeat(); // types '>' on console 
          //last_error = undefined;
          if (this.ISUDPOUTCONNECTED ) show_stream_rates('udpout',1)
        },1000);


        this.on('message',function(msg,rinfo){


            if (this.is_output === undefined ) generic_out_sender(msg); // also forward the packet to all --outputs

//-------------------------------------------------------
    // we don't know its sysid yet, but this means we can at least send broadcast/s like heartbeat
            broadcast_ip_address = {'ip':rinfo.address,'port':rinfo.port, 'type':'udpout' }; 

            this.ISUDPOUTCONNECTED = true; 

            var array_of_chars = Uint8Array.from(msg) // from Buffer to byte array

            //console.log("\nUDPRAW:"+array_of_chars+" len:"+array_of_chars.length);

            var packetlist = [];
            //var mavlinktype = undefined;
            // lets try to support mav1/mav2 with dual parsers.
            if (array_of_chars[0] == 253 ) { 
                packetlist = mpo.parseBuffer(array_of_chars); // emits msgs from here woth parsed result
                //mavlinktype = 2; // known bug, at the moment we assume that if we parsed ONE packet for this sysid in the start of the stream as mav1 or mav2, then they all are
            } 
         
            // if there's no readable packets in the byte stream, dont try to iterate over it
            if (packetlist == null ) return;


            // all msgs in this block came from the same ip/port etc, so we just process the first one for the lookup table.
            if ( packetlist &&  packetlist[0] && packetlist[0]._header !== undefined ) 
                sysid_to_ip_address[packetlist[0]._header.srcSystem] = {'ip':rinfo.address, 'port':rinfo.port, 'type':"udpout" }; 

//--------------------------------------------------------

        });

    }


}


class SmartUDPInLink extends dgram.Socket {

    constructor (portnum,is_output) {
        super('udp4')

        this.bind(portnum);

        this.ISUDPINCONNECTED = false; 
        this.smarttype = 'udp'; // needs to match the 'type': xxxx in sysid_to_ip_address 
        this.is_output = is_output;
        this.last_rinfo = undefined;
        this.eventsetup();
    }

    is_connected() { return this.ISUDPINCONNECTED; }

    // matches name used by net.Socket
    destroy() {
        //https://nodejs.org/api/dgram.html#socketdisconnect
        //ERR_SOCKET_DGRAM_NOT_CONNECTED
        try {
        this.disconnect(); //disassociates a connected dgram.Socket from its remote address
        } catch (e) {
            console.log("no-biggie...",e);
        } 
        this.close(); //close the underlying socket and stop listening for data on it. 
        this.ISUDPINCONNECTED = false; 
    }

  // basic checks of udp link before trying to send
    heartbeat() {
       if ( ! this.ISUDPINCONNECTED ) return ;

        // todo implement some thing that sends a heartbeat to each active udp stream ?

        send_heartbeat_handler();

    }

    ZZsend(data) {
            if (this.last_rinfo == undefined ) return;
            data = new Buffer.from(data)
            this.send( data,this.last_rinfo.port , this.last_rinfo.address ); 
    }

    eventsetup(){

        // hook udp listener events to actions:
        this.on('error', (err) => {
            this.ISUDPINCONNECTED = false; 
            console.log(`udp server error:\n${err.stack}`);
        });

        // UDPSERVER IS DIFFERENT TO TCP CLIENT BUT SIMILAR>>>
        this.on('message', (msg, rinfo) => {

             if (this.is_output === undefined ) generic_out_sender(msg); // also forward the packet to all --outputs

            this.last_rinfo = rinfo;

            // we don't know its sysid yet, but this means we can at least send broadcast/s like heartbeat
            broadcast_ip_address = {'ip':rinfo.address,'port':rinfo.port, 'type':'udp' }; 

            this.ISUDPINCONNECTED = true; 

            var array_of_chars = Uint8Array.from(msg) // from Buffer to byte array

            //console.log("\nUDPRAW:"+array_of_chars+" len:"+array_of_chars.length);

            var packetlist = [];
            //var mavlinktype = undefined;
            // lets try to support mav1/mav2 with dual parsers.
            if (array_of_chars[0] == 253 ) { 
                packetlist = mpo.parseBuffer(array_of_chars); // emits msgs from here woth parsed result
                //mavlinktype = 2; // known bug, at the moment we assume that if we parsed ONE packet for this sysid in the start of the stream as mav1 or mav2, then they all are
            } 
         
            // if there's no readable packets in the byte stream, dont try to iterate over it
            if (packetlist == null ) return;

            // all msgs in this block came from the same ip/port etc, so we just process the first one for the lookup table.

            if ( packetlist[0] === undefined ) return;
            if ( packetlist[0]._header !== undefined ) 
             sysid_to_ip_address[packetlist[0]._header.srcSystem] = {'ip':rinfo.address, 'port':rinfo.port, 'type':"udp" }; 
        });

        // this is a upd-server heartbeat handler at 1hz
        var tt = this;
        this.heartbeat_interval = setInterval(function(){
          //if (client != undefined ) client.send_heartbeat(); // types '>' on console 
          if (tt != undefined ) tt.heartbeat(); // types '>' on console 
          //if (serialport != undefined ) serialport.send_heartbeat(); // types '>' on console 
          //last_error = undefined;
          if (this.ISUDPINCONNECTED ) show_stream_rates('udp',0)
        },1000);

    }

} // end connecting udp_server

//----------------------------------------------------------------------------------

var last_pkt_cnt = 0;
var rate = 0;
var data_timeout = 0;
var last_type = undefined;
var highest_priority = -1;

var show_stream_rates = function(type,priority) {

    if ( (type != last_type) && (priority > highest_priority )) { data_timeout=0;   last_type =type;  highest_priority =priority; }

    var newrate = (mpo.total_packets_received- last_pkt_cnt);

    if ((newrate == 0 )&& (priority == highest_priority) ) {data_timeout++;} else {data_timeout=0;}

    // allow a bit of jitter without reporting it
    if ( (priority == highest_priority) && ( Math.abs(rate - newrate) > 40)) {
        console.log("streamrate changed:",newrate," trend:",rate,"p/s");
    } 

    if ((newrate == 0) && (priority == highest_priority) ) {
        console.log(type," DRONE LINK OFFLINE",highest_priority,priority);
        //if (type == 'udpout') this.ISUDPOUTCONNECTED=false;
        if (type == 'udpin') this.ISUDPINCONNECTED=false;
    } 

    // if "streamrate changed 0 p/s" for the ~5 seconds then consider other end has gone away and warn...
    // since UDP connections are 'connectionless', we use streamrate of zero as a proxy for 'disconnected'.
    // as a bonus... when this happens, the TCP auto-conenct code will start re-trying, till we get a stream from either one of them.
    if ((data_timeout > 5) && (this.ISUDPINCONNECTED)) { 
        console.log("IN udp stream has gone away, sorry.");
        this.ISUDPINCONNECTED=false;
    }
    if ((data_timeout > 5) && (this.ISUDPOUTCONNECTED)) { 
        console.log("OUT udp stream has gone away, sorry.");
        this.ISUDPOUTCONNECTED=false;
    }

    //first time through, assume 120 for no reason other than its plausible, 'newrate' works well for non-serials.
    if ((priority == highest_priority) && (rate == 0)) { rate = 120;} 
    if (priority == highest_priority) { rate = Math.floor(((rate*2)+newrate)/3); }

    last_pkt_cnt = mpo.total_packets_received;


    //console.log("which is connected? udpin.",this.ISUDPINCONNECTED,"udpout.",this.ISUDPOUTCONNECTED,"tcp.",this.ISTCPCONNECTED,"serial.",this.ISSERIALCONNECTED);
}
//----------------------------------------------------------------------------------



module.exports = {SmartSerialLink,SmartUDPInLink,SmartUDPOutLink,SmartTCPLink,mpo};


