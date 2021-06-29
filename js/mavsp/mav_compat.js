// a ingle jspack instance/ singleton
jspack = new JSPack();

// based on a similar node feature in the 'util' library
inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };

  // based on a similar node feature, but with uuid's available and works in-browser
  /// if uuid is passed in at "on(x,...,someuuid)", then u can later use the same uuid in off(x,someuuid) to remove just that ONE
class EventEmitter{
    constructor(){
      this.callbacks = {}
    }

    uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    on(event, cb, uuid=undefined){
        if (this.callbacks == undefined ) {this.callbacks = {};}
        if(!this.callbacks[event]) this.callbacks[event] = [];

        if ( uuid == undefined) { uuid=this.uuidv4(); }

        console.log('listening for: '+event);
        this.callbacks[event].push({'cb':cb,'uuid':uuid}) ; // callback and uuid wrapped toghether in a minimal obj
        return uuid;
    }

    emit(event, data){
        if (this.callbacks == undefined ) {this.callbacks = {};}
        //if ( event != 'message' ) console.log(event);
        let cbs = this.callbacks[event];
        if(cbs){
            //cbs.forEach(cb => cb(data));
            //cbs.forEach(function callbackFn(obj) { var cb = obj.cb; var uuid = obj.uuid; cb(data,uuid);  });
            cbs.forEach(function callbackFn(obj) { 
              if (obj == undefined ) return;
              var cb = obj.cb;  
              cb(data);  
            });
        }
    }

    removeAllListeners(event) {
      if (this.callbacks == undefined ) {this.callbacks = {};}
      if (this.callbacks[event] != undefined )  {
        this.callbacks[event] = []; // zero-out the list of listeners , if any
       } 
    }

    // for short-term hooks that want to un-listen after a bit
    off(event, REFuuid=undefined) {
      if (this.callbacks == undefined ) {this.callbacks = {};}

      //if ( REFuuid == undefined) { REFuuid=this.uuidv4(); }

      if (this.callbacks[event] != undefined )  { // only bother if there's any listerners
        // shortcut for if only have 1 of them:
        if (this.callbacks[event].length == 1 ) {
          this.callbacks[event] = []; // zero-out the list of listeners , if any
          return;
        }
        // else buzz todo magic to figure which callback..?
        var cbs = this.callbacks[event];
        if ( cbs) {
          cbs.forEach(function callbackFn(obj,idx) { 
                  if (obj == undefined ) return;
                  var cb = obj.cb; 
                  if ( (REFuuid) && (obj.uuid==REFuuid) ) { 
                        this[idx] = undefined; // modifying 'cbs' while iterating it.
                   }  
              },cbs);
        }
        //console.log(this.callbacks[event]);
      }
    }

}


//uses class EventEmitter from mav_xx.js a second time for wrapping the client-side parser with outgoing and incoming callback/s.
MSGHANDLER = function(a){
    this.a = a;
}

//var unused_socket_wrapper = function(message) {
   // if (message.type != 5  ) console.log('socket capture',message);
//}
// Implements EventEmitter
inherits(MSGHANDLER, EventEmitter);
var msghandler = new MSGHANDLER();
//msghandler.on('packet', unused_socket_wrapper);


/*   below blantantly ripped from underscore.js so we don't have to explicitly depend on it any more.*/
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

var shallowProperty = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
};

var getLength = shallowProperty('length');
var isArrayLike = function(collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
var optimizeCb = function(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // The 2-argument case is omitted because we’re not using it.
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
};


// this is inspired by _.each()
function foreach(obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var keys = x.keys(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
};
/*   above blantantly ripped from underscore.js */


// instantiate minimal fake underscore obj as mav_v2.js generated code uses _.has and _.each
_ = {
  has: function(map, msgId) {
    return map.hasOwnProperty(msgId)
  },
  each: foreach
}; 