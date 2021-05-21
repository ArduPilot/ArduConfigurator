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

  // based on a similar node feature
class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if (this.callbacks == undefined ) {this.callbacks = {};}
        if(!this.callbacks[event]) this.callbacks[event] = [];
        console.log('listening for: '+event);
        this.callbacks[event].push(cb)
    }

    emit(event, data){
        if (this.callbacks == undefined ) {this.callbacks = {};}
        //if ( event != 'message' ) console.log(event);
        let cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(data))
        }
    }
}


//uses class EventEmitter from mav_v1.js a second time for wrapping the client-side parser with outgoing and incoming callback/s.
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