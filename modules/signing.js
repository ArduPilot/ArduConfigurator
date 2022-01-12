/*
https://ourcodeworld.com/articles/read/445/how-to-use-event-emitters-with-es5-and-es6-in-node-js-easily

When EventEmitter.call(this) is executed during the creation of an instance from YourLibrary, it appends properties declared from the EventEmitter constructor to YourLibrary. Then the inherits function inherits the prototype methods from one constructor into another (your constructor YourLibrary and the super constructor EventEmitter), in this way the prototype of your constructor will be set to a new object created from superConstructor.

As your library obviously won't offer the same methods of EventEmitter you need to add your own functions to YourLibrary by using prototyping before or after the module.exports line:
*/

// tip: In the top-level code in a Node module, this is equivalent to module.exports. That's the empty object you see.

//YourLibrary = Signing

//NOTE: -  Won't setup signing when armed we auto disarm if armed  - todo, only do it directly before signing..?

// Instantiate event emitter and inherits
var EventEmitter = require('events');
var inherits = require('util').inherits;

var Long = require('long');

// Create the constructor of YourLibrary and add the EventEmitter to this context
var Signing = function (m,mp) {
    var self = this; // 'this' can be fleeting, and changes insiude of callbacks, 'self' wont
    this.m = m;   // mavlink definitions
    this.mp = mp; // mavlink parser
    this.is_armed = undefined;
    this.sysid = undefined;
    this.sig_count = 0; // count of any packets having a signature, irrespective of validity
    this.goodsig_count = 0; // count of sigs that pass
    this.unsigned_count = 0; // count of unsigned packets that were let through WHILE SIGNING - due to 'allow unsigned' policy/callback
    this.total_packet_count = 0; // count of any packets arriving irrespective of signature validity etc.
    this.delayed_ss = undefined;

// 0 means we are verified as working fully UNSIGNED, 1 means SIGNED, 2 means ignoring signatures and working UNSIGNED, undef means dont know yet.
    this.verification_state = undefined ;  

    EventEmitter.call(this); // make this class an event consumer/producter..

    // hook a thing that we want all instances to handle...
    this.on('custom_event', function() {
        self.logSomething('custom_event');
      });

   this.show_state = function(){
        console.log('[signing] this.sig_count',this.sig_count);
        console.log('[signing] this.goodsig_count',this.goodsig_count);
        console.log('[signing] this.unsigned_count ',this.unsigned_count );
        console.log('[signing] this.total_packet_count ',this.total_packet_count );
        console.log('[signing] this.verification_state ',this.verification_state );
    }

   console.log('[signing] module registered for HUD msgs');
   this.on('HUD', function (data) 
    {

    // no need to process all HUD msgs, every 5th or so is enough.
    this.freq = this.freq+1;
    if (this.freq < 5 ) return;
    this.freq = 0;
    
    //console.log('[signing] got HUD msg');
    process.stdout.write('.'); // tickle on screen for seeing activity

        var packets_flowing = function(t) {  
            if ( t.mp.total_packets_received > t.total_packet_count ) {
                t.total_packet_count = t.mp.total_packets_received;
                return true
            }
            return false
        }
        var any_sigs_arriving = function(t) {  
            if ( t.mp.signing.sig_count > t.sig_count ) {
                t.sig_count = t.mp.signing.sig_count;
                return true
            }
            return false
        }
        var good_sigs_arriving = function(t) {  
            if ( t.mp.signing.goodsig_count > t.goodsig_count ) {
                t.goodsig_count = t.mp.signing.goodsig_count;
                return true
            }
            return false
        }
        var packets = packets_flowing(this);
        var anysigs = any_sigs_arriving(this);
        var goodsigs = good_sigs_arriving(this);

       // goodsig_count increasing indicates signing is ON.
       if ((this.verification_state != 1) && packets && anysigs && goodsigs ) {  
 
         console.log('\n[signing] ACTIVE ');  //GOT -signed- HUD OK
         this.goodsig_count = this.mp.signing.goodsig_count;
         this.verification_state = 1;
         this.sig_count = this.mp.signing.sig_count ;
         this.show_state()
       }
       // goodsig_count NOT increasing, and sig_count not increasing , but total_packets_received incrasing indicates signing is OFF
       if ((this.verification_state != 0) && packets && !anysigs && !goodsigs ) {   

         console.log('\n[signing] DISABLED '); //GOT -un-signed- HUD OK
         this.total_packet_count = this.mp.total_packets_received;
         this.sig_count = this.mp.signing.sig_count;
         this.verification_state = 0;
         this.show_state()
       }

       // goodsig_count NOT increasing, but sig_count incrasing indicates signing is OFF but incoming packets are still signed
       if ((this.verification_state != 2) && packets && anysigs && !goodsigs ) {   

         console.log('\n[signing] DISABLED -  with signed incoming packets'); //GOT -un-signed- HUD OK
         this.sig_count = this.mp.signing.sig_count;
         this.verification_state = 2;
         this.show_state()
       }

       // try to disarm, but only if signing isnt already active and there's at least some sort of data stream
       if ( (this.delayed_ss !== undefined ) && packets && (this.verification_state != 1) && (this.mp !== undefined )) { 
            if ( this.is_armed == true) {
                if (this.sysid !== undefined) {

                    var target_system = this.sysid, target_component = 0, command = m.MAV_CMD_COMPONENT_ARM_DISARM, confirmation = 0, 
                        param1 = 0, param2 = 0, param3 = 0, param4 = 0, param5 = 0, param6 = 0, param7 = 0;
                    // param1 is 1 to indicate arm/disarm... 1=arm,0=disarm
                    var command_long = new m.messages.command_long(target_system, target_component, command, confirmation, 
                                                                     param1, param2, param3, param4, param5, param6, param7)
                    this.mp.send(command_long,this.sysid);
                    console.log("[signing] attempting DISARM of sysid:"+this.sysid);
                }
           }
        }
    });

   // the 'mode' message is like 'armed' message, but has more info, including sysid
   this.on('mode', function (data) 
    {
       if (this.sysid != data.sysid) {
             if (data.sysid == true ) console.log("[signing] FOUND sysid:"+data.sysid);
             this.sysid = data.sysid;
       }

       if (this.is_armed != data.armed) {
             if ((this.is_armed != undefined )&&(data.armed == false )) console.log("[signing] DISARM-ed sysid:"+data.sysid);
             this.is_armed = data.armed;
             if (this.delayed_ss !== undefined ) {
                    var tmp = this.delayed_ss;
                    this.delayed_ss = undefined;
                    this.cmd_signing_setup(tmp);// try again
                }
       }
    });

    this.on('message', function (data) 
    {
        var msgname = data.name;
    });
}

// pythonise
function print(args) {
console.log(args);
}

Signing.prototype.passphrase_to_key = function(passphrase){

     // convert a passphrase to a 32 byte key
        var crypto= require('crypto'); 
        var h =  crypto.createHash('sha256'); 
        h.update(new Buffer.from(passphrase)); 
        return h.digest()
}

// relevant to how we pass-in the Long object/s to jspack, we'll assume the calling user is smart enough to know that.
var wrap_long = function (someLong) {
    return [someLong.getLowBitsUnsigned(), someLong.getHighBitsUnsigned()];
}


// args = list of words - first word=scret key, second word optionally=sysid
Signing.prototype.cmd_signing_setup = function(args) {
  console.log("SIGNING SETUP",args);

        if (args.length > 1) {this.sysid=args[1]}

        if ( this.sysid == undefined) {
            print("cant sign without knowing the sysid")
            return
        }

        if (args.length == 0){
            print("usage: signing setup passphrase")
            return}
        if ( this.mp.signing === undefined ){
            print("You must be using recent MAVLink2 parser for signing")
            return}

        // if armed or unsure of the arming state, delay the command till we know
        if (this.is_armed !== false) { 
            this.delayed_ss = args;
            return;
        }

        passphrase = args[0]
        secret_key = this.passphrase_to_key(passphrase) // key is a Buffer obj or the right type

        epoch_offset = 1420070400;

        let date_ob = new Date();         // new Date object,
        secs_since_epoch = date_ob.getTime() / 1000 ;  /// Date.getTime() returns ms , python was time.time()
        now = Math.max(secs_since_epoch, epoch_offset)
        initial_timestamp = Math.floor((now - epoch_offset)*1e5) // python was int(..)
        var x= Long.fromString(initial_timestamp.toString(), true);
        var long_timestamp = wrap_long(x); 

        //this.mp.srcSystem = 255;    // note that srcSystem should be 255 to match python
        var target_system = this.sysid;  // and also target=1 to match python
        var target_component = 0;

        var setup_signing = new this.m.messages.setup_signing(target_system, target_component, secret_key, long_timestamp);
        //console.log(setup_signing);
        this.mp.send(setup_signing,this.sysid);

        print("Sent secret_key")
        this.cmd_signing_key([passphrase])

/*
        // todo - do we need to reset more of these?
        this.mp.signing.timestamp = 1 
        this.mp.signing.link_id = 0 
        this.mp.signing.sign_outgoing = false
        this.mp.signing.allow_unsigned_callback = undefined 
        this.mp.signing.stream_timestamps = {} 
        this.mp.signing.sig_count = 0 
        this.mp.signing.badsig_count = 0 
        this.mp.signing.goodsig_count = 0 
        this.mp.signing.unsigned_count = 0 
        this.mp.signing.reject_count = 0 
*/

        // drop knowledge of all previous timestamps, assuming we have 1 link, this is ok
        this.mp.signing.stream_timestamps = {}

        this.mp.signing.sign_outgoing = true;
        this.mp.signing.allow_unsigned_callback = function allow_unsigned_callback() { 
                                                    if( typeof allow_unsigned_callback.counter == 'undefined' ) {
                                                        allow_unsigned_callback.counter = 0;
                                                        console.log('code policy allows unsigned');
                                                    }
                                                    allow_unsigned_callback.counter++;
                                                    return true ; // change this to disallow unsigned
                                                } 

}

Signing.prototype.cmd_signing_unsetup = function() {
  console.log("SIGNING REMOVE");

        if ( this.sysid == undefined) {
            print("cant sign without knowing the sysid")
            return
        }

        var target_system = 255;
        var target_component = 0;

        var x= Long.fromString('0', true); // timestamp of 0
        var long_timestamp = wrap_long(x); 


        this.mp.signing.secret_key = new Buffer.from([]);

        var setup_signing = new this.m.messages.setup_signing(target_system, target_component, this.mp.signing.secret_key, long_timestamp);
        this.mp.send(setup_signing,this.sysid);

        print("Removed secret_key")



        this.mp.signing.sign_outgoing = false;
        this.mp.signing.allow_unsigned_callback = undefined;


}



// todo use this..?
Signing.prototype.allow_unsigned = function(args) {
  console.log("SIGNING unsigned ALLOWED?",args);

  // def allow_unsigned(self, mav, msgId):
  //      '''see if an unsigned packet should be allowed'''
  //      if this.allow is None:
  //          self.allow = {
  //              mavutil.mavlink.MAVLINK_MSG_ID_RADIO : True,
  //              mavutil.mavlink.MAVLINK_MSG_ID_RADIO_STATUS : True
  //              }
  //      if msgId in self.allow:
  //          return True
  //      if self.settings.allow_unsigned:
     //to do implement me.

            return True
}

Signing.prototype.cmd_signing_key = function(args) {
  //console.log("SIGNING KEY",args);

        if ( this.sysid == undefined) {
            print("cant sign without knowing the sysid")
            return
        }

        if (args.length == 0){
            print("usage: signing setup passphrase")
            return}
        if ( this.mp.signing === undefined ){
            print("You must be using recent MAVLink2 parser for signing")
            return}

        passphrase = args[0]
        secret_key = this.passphrase_to_key(passphrase)

        this.mp.signing.secret_key = secret_key;


        //print("Setup signing key")

}

// Use Inheritance to add the properties of the DownloadManager to event emitter
inherits(Signing, EventEmitter);

// Export YourLibrary !
module.exports = Signing;

//----------------------

Signing.prototype.testAsyncMethod = function testAsyncMethod(someData) {
    _this = this;

    // Execute the data event in 2 seconds
    setTimeout(function(){
        // Emit the data event that sends the same data providen by testAsyncMethod 
        _this.emit("signing-async", someData);
    }, 2000);
};



