;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Hiraya = {
  /** hiraya-core **/
  Class: require('./hiraya-core/class'),
  Emitter: require('./hiraya-core/emitter'),
  Collection: require('./hiraya-core/collection'),
  /** hiraya-game **/
  Game: require('./hiraya-game/game'),
  Level: require('./hiraya-game/level')
  /** hiraya-game/display **/
};

if (typeof window === 'object') {
  window.Hiraya = Hiraya;
}

module.exports = Hiraya;

},{"./hiraya-core/class":2,"./hiraya-core/emitter":3,"./hiraya-core/collection":4,"./hiraya-game/game":5,"./hiraya-game/level":6}],2:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-core
 */


/**
 * Flag to prevent the Class.proto.init from being invoked during initialization
 */
var start = true;

/**
 * Creates a shim for invoking a this.parent() command by wrapping it inside a closure
 */
function protoParent(prototype, name, method) {
  return function() {
    this.parent = prototype[name];
    return method.apply(this, arguments);
  };
}

/**
 * Extends an object's properties and assign them as prototypes in a Function
 */
function extendClass(BaseClass, properties) {
  var parent = BaseClass.prototype;
  start = false;
  var prototype = new BaseClass();
  start = true;
  var attribute;
  // iterate over the properties and copy them.
  for(var name in properties) {
    if (properties.hasOwnProperty(name)) {
      attribute = properties[name];
      prototype[name] = typeof parent[name] === 'function' && typeof properties[name] === 'function' ?
        protoParent(parent, name, attribute) :
        attribute;
    }
  }

  /**
   * `Hiraya.Class` can be used for prototypal inheritance.
   *
   *     var Human = Hiraya.Class.extend({
   *        baseHealth: 100,
   *        baseAttack: 10,
   *        health: null,
   *        init: function() {
   *          this.health = this.baseHealth;
   *        },
   *        attack: function(enemy) {
   *          this.enemy.health -= this.baseAttack;
   *        }
   *     });
   *
   *     var Orc = Human.extend({
   *        baseHealth: 200,
   *        attack: function(enemy) {
   *          // class methods have super methods
   *          this.super(enemy);
   *          this.shout('waaagh!');
   *        },
   *        shout: function(message) {
   *          alert(message);
   *        }
   *     });
   *
   *     var human = Human.create();
   *     var Orc = Orc.create();
   *
   *     // You can also override certain properties on instantiation
   *     var superman = Human.create({
   *        baseHealth: 10000,
   *        baseAttack: 10000
   *     });
   * 
   * @class Class
   * @namespace Hiraya
   */
  function Class() {
    // use the init method to define your constructor's content.
    if (start && this.init && this.init.apply) {
      this.init.apply(this, arguments);
    }
  }

  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  /**
   * Extends the base class
   * @method extend
   * @param {Object} attributes
   * @static
   * @return {Class}
   */
  Class.extend = function(attributes) {
    return extendClass(Class, attributes);
  };

  /**
   * Instatiates the class
   * @method create
   * @param {Object} attributes
   * @static
   * @return {Class}
   */
  Class.create = function(attributes) {
    var ClassExtend = Class.extend(attributes);
    return new ClassExtend();
  };
  return Class;
}

var Class = extendClass(function(){}, {});

module.exports = Class;

},{}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],8:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":7}],3:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-core
 */


var Class = require('./class');
var EventEmitter = require('events').EventEmitter;

/**
 * `Hiraya.Emitter` handles event-based callbacks.
 * For example if you wish to create an event manager that dispatches data
 * everytime a certain topic is called:
 *
 *      Game.topicEmitter = Hiraya.Emitter.create({
 *        newTopic: function(topic) {
 *          this.emit('newTopic', topic);
 *        }
 *      });
 *
 *      Game.topicEmitter.on('newTopic', function(topic) {
 *        console.log('Got a new topic:', topic);
 *      });
 *
 *      Game.topicEmitter.newTopic('entityCreate');
 *
 * @class Emitter
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Emitter = Class.extend({
  init: function() {
  },
  /**
   * Adds a listener to the emitter object
   *
   * @method on
   * @param {String} topic 
   * @param {Function} callback 
   * @chainable
   */
  on: function() {
    EventEmitter.prototype.on.apply(this, arguments);
    return this;
  },

  /**
   * Removes a listener from the emitter object
   *
   * @method off
   * @param {String} topic
   * @param {Function} callback
   * @chainable
   */
  off: function(topic, callback) {
    EventEmitter.prototype.removeListener.apply(this, arguments);
    return this;
  },


  /**
   * Removes all listeners or the topic specified
   *
   * @method offAll
   * @param {String} [topic]
   * @chainable
   */
  offAll: function() {
    EventEmitter.prototype.removeAllListeners.apply(this, arguments);
    return this;
  },

  /**
   * Emits a topic contained in the emitter object
   *
   * @method emit
   * @param {String} topic
   * @param {Object|String} data*
   * @chainable
   */
  emit: function() {
    EventEmitter.prototype.emit.apply(this, arguments);
    return this;
  },

  /**
   * Subscribes to a topic only once
   *
   * @method once
   * @param {String} topic
   * @chainable
   */
  once: function() {
    EventEmitter.prototype.once.apply(this, arguments);
    return this;
  },


  /**
   * Remove an event listener
   *
   * @methoda removeListener
   * @param {String} topic
   * @param {Function} callback
   * @private
   * @chainable
   */
  removeListener: function() {
    EventEmitter.prototype.removeListener.apply(this, arguments);
    return this;
  }
});


module.exports = Emitter;

},{"events":8,"./class":2}],4:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-core
 */


var Emitter = require('./emitter');


/**
 * `Hiraya.Collection` handles list of objects that can be stored and retrieved.
 *
 * @class Collection
 * @extends Hiraya.Emitter
 * @namespace Hiraya
 */
var Collection = Emitter.extend({
  /**
   * @property {Array} _list
   * @private
   */
  _list: null,

  /**
   * Total elements in the collection. This gets updated whenever a new child is added or removed
   *
   *     var collection = Hiraya.Collection.create();
   *     collection.length; // -> 0
   *     collection.add({ name: 'James' });
   *     collection.length; // -> 1
   *
   * @property length
   * @type {Number}
   * @default 0
   */
  length: null,

  init: function() {
    this._list = [];
    this._updateLength();
  },

  /**
   * Updates the `length` property.
   *
   * @method _updateLength
   * @private
   */
  _updateLength: function() {
    this.length = this._list.length;
  },

  /**
   * Adds an element to the list
   * @method add
   * @param {Object} obj
   * @chainable
   */
  add: function(obj) {
    this._list.push(obj);
    this._updateLength();
    return this;
  },

  /**
   * Removes an element from the list
   *
   * @method remove
   * @param {Object} obj
   * @chainable
   */
  remove: function(obj) {
    this._list.splice(this._list.indexOf(obj), 1);
    this._updateLength();
    return this;
  },

  /**
   * Returns an element from the array by its index value
   *
   * @method at
   * @param {Number} index
   * @returns {Object}
   */
  at: function(index) {
    return this._list[index];
  }
});

module.exports = Collection;

},{"./emitter":3}],5:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */



var Emitter = require('../hiraya-core/emitter');

/**
 * `Hiraya.Game` is the entry point of the framework. Instantiating this will serve as your namespace,
 * as well as reference to instantiated objects that the Hiraya framework provides.
 *
 * @class Game
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Game = Emitter.extend({
  /**
   * The `ready` event fires when the window is ready and all the assets are loaded
   *
   * @event ready
   */
  ready: function() {
  }
});

module.exports = Game;

},{"../hiraya-core/emitter":3}],6:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */


var Emitter = require('../hiraya-core/emitter');
var Collection = require('../hiraya-core/collection');

/**
 * `Hiraya.Level` manages the game logic and entity interaction.
 *
 * @class Level
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Level = Emitter.extend({
  /**
   * @property entities
   * @type {Array}
   */
  entities: null,

  init: function() {
    this.entities = Collection.create();
    this.parent();
  },
});

module.exports = Level;

},{"../hiraya-core/emitter":3,"../hiraya-core/collection":4}]},{},[1])
;