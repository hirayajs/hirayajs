;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Hiraya = {
  /** hiraya-core **/
  Class: require('./hiraya-core/class'),
  Emitter: require('./hiraya-core/emitter'),
  Collection: require('./hiraya-core/collection'),
  Stat: require('./hiraya-game/stat'),
  Stats: require('./hiraya-game/stats'),
  EntityTurnBased: require('./hiraya-game/entity-turnbased'),
  Entity: require('./hiraya-game/entity'),

  /** hiraya-game **/
  Game: require('./hiraya-game/game'),
  Tile: require('./hiraya-game/tile'),
  Tiles: require('./hiraya-game/tiles'),
  TilesHex: require('./hiraya-game/tiles-hex'),
  Level: require('./hiraya-game/level'),
  LevelTurnBased: require('./hiraya-game/level-turnbased'),
  Command: require('./hiraya-game/command'),

  /** hiraya-view **/
  Canvas: require('./hiraya-view/canvas'),
  Sprite: require('./hiraya-view/sprite'),

  /** hiraya-util **/
  HexagonUtil: require('./hiraya-util/hexagon-util')

};

if (typeof window === 'object') {
  window.Hiraya = Hiraya;
}

module.exports = Hiraya;

},{"./hiraya-core/class":2,"./hiraya-core/emitter":3,"./hiraya-core/collection":4,"./hiraya-game/stat":5,"./hiraya-game/stats":6,"./hiraya-game/entity-turnbased":7,"./hiraya-game/entity":8,"./hiraya-game/game":9,"./hiraya-game/tile":10,"./hiraya-game/tiles":11,"./hiraya-game/tiles-hex":12,"./hiraya-game/level":13,"./hiraya-game/level-turnbased":14,"./hiraya-game/command":15,"./hiraya-view/canvas":16,"./hiraya-view/sprite":17,"./hiraya-util/hexagon-util":18}],2:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-core
 */


/**
 * Flag to prevent the Class.proto.init from being invoked during initialization
 */
var start = true;

/**
 * Creates a shim for invoking a this._super() command by wrapping it inside a closure
 */
function protoSuper(prototype, name, method) {
  return function() {
    this._super = prototype[name];
    return method.apply(this, arguments);
  };
}

function isClassObject(fn) {
  var truth = false;
  for (var key in fn.prototype) {
    truth = true;
  }
  return truth;
}

/**
 * Extends an object's properties and assign them as prototypes in a Function
 */
function extendClass(BaseClass, properties) {
  var _super = BaseClass.prototype;
  start = false;
  var prototype = new BaseClass();
  start = true;
  var attribute;
  // iterate over the properties and copy them.
  for(var name in properties) {
    if (properties.hasOwnProperty(name)) {
      attribute = properties[name];
      prototype[name] = typeof _super[name] === 'function' &&
        typeof attribute === 'function' &&
        // check if it's a Class by checking its list of prototype properties
        // no _super should be assigned if ever.
        !isClassObject(attribute) ? // make sure we're assigning a proto _super only for functions
        protoSuper(_super, name, attribute) :
        attribute;
    }
  }

  /**
   * `Hiraya.Class` is the heart of all Hiraya objects. It can be used for prototypal inheritance.
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
   *          // class methods have _super methods
   *          this._super(enemy);
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
   * @param {Object} attributes*
   * @static
   * @return Class
   */
  Class.extend = function(attributes) {
    var attributesArray = Array.prototype.slice.apply(arguments, arguments, 0);
    var attribs = {};
    for (var i=0; i < attributesArray.length; i++) {
      var attrib = attributesArray[i];
      for(var key in attrib) {
        if (attrib.hasOwnProperty(key)) {
          attribs[key] = attrib[key];
        }
      }
    }
    return extendClass(Class, attribs);
  };

  /**
   * Instatiates the class. You can optionally pass attributes to set as its default value.
   *
   * example:
   *
   *     var Car = Class.extend({
   *       accleration: 10,
   *       accelerate: function() {
   *         this.position += this.acceleration;
   *       }
   *     });
   *
   *     var Ferrari = Car.create({
   *       acceleration: 100
   *     });
   *
   * @method create
   * @param {Object} attributes
   * @static
   * @return Class
   */
  Class.create = function(attributes) {
    var ClassExtend;
    if (typeof attributes === 'object') {
      ClassExtend = Class.extend(attributes);
      return new ClassExtend();
    } else {
      return new Class();
    }
  };
  return Class;
}

var Class = extendClass(function(){}, {});

module.exports = Class;

},{}],18:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-util
 */


/**
 * A static utility class for laying out hexagonal board games.
 *
 * @class HexagonUtil
 * @namespace Hiraya
 * @final
 */
var HexagonUtil = {
  /**
   * The width resource of the hexagon used for the board.
   * @property WIDTH
   * @static
   */
  WIDTH: 80,

  /**
   * The height resource of the hexagon used for the board.
   * @property HEIGHT
   * @static
   */
  HEIGHT: 60,

  /**
   * Set the display object's x and y position based on the tile's hexagonal counterpart.
   *
   * @method position
   * @param {createjs.DisplayObject} object
   * @param {Hiraya.Tile} tile
   * @param {Boolean} center
   * @return {Object} coordinates
   */
  position: function(object, tile, center) {
    var coordinates = this.coordinates(tile, center);
    object.regX = this.WIDTH * 0.5;
    object.regY = this.HEIGHT * 0.5;
    object.x = coordinates.x + object.regX;
    object.y = coordinates.y + object.regY;
    return coordinates;
  },

  /**
   * Get the raw coordinate of a tile translated to a tile in a hexagonal map.
   *
   * @method coordinates
   * @param {Hiraya.Tile} tile
   * @param {Boolean} center
   * @return Object
   */
  coordinates: function(tile, center) {
    if (!tile) return null;
    return {
      x: tile.x * this.WIDTH + (tile.y % 2 ? this.WIDTH * 0.5 : 0) + (center ? this.WIDTH * 0.5 : 0),
      y: tile.y * (this.HEIGHT - this.HEIGHT * 0.25) + (center ? this.HEIGHT * 0.5 : 0)
    };
  },

  /**
   * Gets the dimensions if the Hexagon tile was to be placed
   * in a board.
   *
   * @method dimensions
   * @param {int} columns
   * @param {int} rows
   * @returns {Object}
   */
  dimensions: function(columns, rows) {
    var width = columns * this.WIDTH + this.WIDTH;
    var height = rows * this.HEIGHT;
    return {
      width: width,
      height: height
    };
  }
};

module.exports = HexagonUtil;

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
},{"__browserify_process":19}],4:[function(require,module,exports){
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
   * @returns Object
   */
  at: function(index) {
    return this._list[index];
  },

  find: function(fn) {
    if (typeof fn === 'function') {
      for (var i = this._list.length - 1; i >= 0; i--){
        var item = this._list[i];
        if (fn(item)) {
          return item;
        }
      }
    }
  },

  /**
   * Iterates to each element in the collection. If the callback parameter returns false, it will halt the looping operation.
   *
   * @method each
   * @param {Function} fn
   */
  each: function(fn) {
    for (var i=0, length = this._list.length; i < length; i++) {
      if (fn(this._list[i]) === false) {
        break;
      }
    }
  },

  /**
   * Returns a clone of the collection which can be used for other purposes outside the normal
   * collection operation.
   *
   * @method list
   * @returns {Array}
   */
  list: function() {
    return this._list.slice();
  }
});

module.exports = Collection;

},{"./emitter":3}],3:[function(require,module,exports){
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

},{"events":20,"./class":2}],5:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Class = require('../hiraya-core/class');

/**
 * `Hiraya.Stat` manages the values for an RPG attribute.
 * It handles things like making sure the value doesn't exceed its maximum capacity.
 *
 * It also provides some useful API for value manipulation.
 *
 * @class Stat
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Stat = Class.extend({
  /**
   * The current value of the stat. To change this,
   * use the `stat.setValue` command.
   *
   * @property value
   * @type {Number}
   * @default 0
   */
  value: null,
  
  /**
   * The maximum value for the stat.
   *
   * @property max
   * @type {Number}
   * @default 0
   */
  max: null,

  /**
   * Name of the stat.
   *
   * @property name
   * @type {String}
   */
  name: null,
  init: function() {
    this.reset(Math.max(this.value, this.max));
  },

  /**
   * Sets the value of the stat. Ensures that it doesn't go beyond zero.
   *
   * @method setValue
   * @param {Number} value
   * @chainable
   */
  setValue: function(value) {
    this.value = Math.max(0, value);
    this.value = Math.min(this.value, this.max);
    return this;
  },

  /**
   * Sets the value of the max value. Ensures that it doesn't go beyond zero.
   *
   * @method setMax
   * @param {Number} value
   * @chainable
   */
  setMax: function(value) {
    this.max = Math.max(0, value);
    return this;
  },

  /**
   * Empties the value of the stat.
   *
   * @method empty
   * @chainable
   */
  empty: function() {
    this.value = 0;
    return this;
  },

  /**
   * Increases the value of the stat. Increments the `.value` property by 1 if the value argument is undefined.
   *
   * @method add
   * @param {Number} [value=1]
   * @chainable
   */
  add: function(value) {
    this.setValue(this.value + (typeof value === 'number' ? value : 1));
    return this;
  },

  /**
   * Reduces the value by one. Decrements the `.value` property by 1 if the value argument is undefined.
   *
   * @method reduce
   * @param {Number} [value=1]
   * @chainable
   */
  reduce: function(value) {
    this.setValue(this.value - (typeof value === 'number' ? value : 1));
    return this;
  },

  /**
   * Resets the value according to its max value. Max value can be optionally
   * set by providing a value argument.
   *
   * @method reset
   * @param {Number} [value=null]
   * @chainable
   */
  reset: function(value) {
    if (typeof value === 'number') {
      this.setMax(value);
    }
    this.value = this.max;
    return this;
  },

  /**
   * Checks if the stat is full
   *
   * @method isMax
   * @returns Boolean
   */
  isMax: function() {
    return this.value === this.max;
  },

  /**
   * Tells if the stat value is 0.
   *
   * @method isEmpty 
   * @returns Boolean
   */
  isEmpty: function() {
    return this.value === 0;
  }
});

module.exports = Stat;

},{"../hiraya-core/class":2}],6:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Class = require('../hiraya-core/class');
var Stat = require('./stat');

/**
 * `Hiraya.Stats` handles all stat related object. This is quite useful as a container
 * for all attributes for a character to prevent clutter in the attributes of a `Hiraya.Entity` instance.
 *
 * Although it is used primarily for RPG stats, you are free to use it elsewhere.
 *
 *     var stats = Hiraya.Stats.create();
 *     stats
 *       .set('health', 100)
 *       .set('mana', 100);
 *
 * @class Stats
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Stats = Class.extend({
  /**
   * Default stat object returned in the `.get` method. Has a value of 1 and max value of 1.
   *
   * @property none
   * @type {Stat}
   */
  none: null,
  init: function() {
    this.set('none', 0, 0);
  },

  /**
   * Sets or creates the value of a stat attribute. You can optionally set the max value as well
   *
   * @method set
   * @param {String} name
   * @param {Number} value
   * @param {Number} [max=value]
   * @chainable
   */
  set: function(name, value, max) {
    var stat = this[name];
    var maxValue = typeof max === 'number' ? max : value;
    if (stat) {
      stat.setMax(maxValue);
      stat.setValue(value);
    } else {
      stat = Stat.create();
      stat.name = name;
      stat.setMax(maxValue);
      stat.setValue(value);
      this[name] = stat;
    }
    return this;
  },

  /**
   * Returns a stat attribute by name. Returns an empty stat object if the stat name doesn't exist.
   *
   *     var stats = Hiraya.Stats.create();
   *     stats
   *       .set('health', 100)
   *       .set('mana', 100);
   *     stats.get('health').value; // -> 100
   *     stats.get('noneExistingStatName').value; // -> 0
   *
   *
   * @method get
   * @param {String} name
   * @returns Hiraya.Stat
   */
  get: function(name) {
    return this[name] ? this[name] : this.none;
  }
});

module.exports = Stats;

},{"../hiraya-core/class":2,"./stat":5}],7:[function(require,module,exports){
var Entity = require('./entity');

var EntityTurnBased = Entity.extend({
  init: function() {
    this._super();
    this.stats.set('turn', 0, 100);
    this.stats.set('steps', 1);
    this.stats.set('range', 2);
    this.stats.set('turnspeed', 10);
  }
});

module.exports = EntityTurnBased;

},{"./entity":8}],8:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */


var GetterSetter = require('../hiraya-core/getter-setter');
var Stats = require('./stats');

/**
 * A basic game entity that has basic API like stats, attack and damage commands.
 *
 * @class Entity
 * @extends Hiraya.GetterSetter
 * @namespace Hiraya
 */
var Entity = GetterSetter.extend({
  /**
   * The id of the entity. Can be set uniquely or use the default Entity class ID
   *
   * @property id
   * @type {Number}
   */
  id: null,
  init: function() {
    if (this.id === undefined) {
      this.id = Entity.id++;
    }
    this.stats = Stats.create();
    this.stats
      .set('health', 100)
      .set('attack', 100);
    this._super();
  },

  /**
   * Attacks an enemy based on its attack stat value
   *
   * @method attack
   * @param {Entity} enemyEntity
   * @chainable
   */
  attack: function(enemyEntity) {
    enemyEntity.damage(this.stats.attack.value);
    return this;
  },

  /**
   * Reduces health by 1
   *
   * @method damage
   * @param {Number} damage
   * @chainable
   */
  damage: function(damage) {
    this.stats.health.reduce(damage);
    return this;
  },

  /**
   * Set the entity's attributes
   *
   * @method setStats
   * @param {Object} attributes
   */
  setStats: function(attributes) {
    for(var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = Stat.create({ max: attributes[key] });
      }
    }
  }
});

/**
 * An id counter for the Entity class
 *
 * @property id
 * @static
 * @type {Number}
 */
Entity.id = 0;

module.exports = Entity;

},{"../hiraya-core/getter-setter":21,"./stats":6}],9:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */



var Emitter = require('../hiraya-core/emitter');
var Level = require('../hiraya-game/level');
var Tiles = require('../hiraya-game/tiles');

/**
 * `Hiraya.Game` is the entry point of the framework. Instantiating this will serve as your namespace,
 * as well as reference to instantiated objects that the Hiraya framework provides.
 *
 *     Game = Hiraya.Game.create();
 *     Game.start(); // Game does its work like preloading assets, initializing classes, etc.
 *
 * @class Game
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Game = Emitter.extend({
  /**
   * Path dictionary
   *
   * @property paths
   * @type {Object}
   * @private
   */
  _paths: {},

  /**
   * The base level class of the game
   *
   * @property Level
   * @type {Level}
   * @default Hiraya.Level
   * @return this
   */
  Level: Level,

  start: function() {
    var _this = this;
    this._paths = {};
    this._paths.level = this.Level.create();
    if (this.Canvas && typeof this.Canvas.create === 'function') {
      this._paths.canvas = this.Canvas.create();
      this.paths('canvas').levelReady(this._paths.level);
    }
    this.ready();
    return this;
  },
  paths: function(path) {
    return this._paths[path];
  },
  /**
   * The `ready` event fires when the window is ready and all the assets are loaded
   *
   * @event ready
   */
  ready: function() {
  }
});

module.exports = Game;

},{"../hiraya-core/emitter":3,"../hiraya-game/level":13,"../hiraya-game/tiles":11}],10:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */


var Class = require('../hiraya-core/class');

/**
 * A tile for a level with tiles
 *
 * @class Tile
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Tile = Class.extend({
  /**
   * x-axis coordinate
   *
   * @property x
   * @type {Number}
   */
  x: null,

  /**
   * y-axis coordinate
   *
   * @property y
   * @type {Number}
   */
  y: null,

  /**
   * The z-index of the tile which is assigned during tile population starting from top left to top bottom.
   *
   * @property z
   * @type {Number}
   */
  z: null,

  /**
   * Determining if the tile is passable. Used in the A-star algorithm.
   *
   * @property isWall
   * @type {Boolean}
   * @default false
   */
  isWall: null,

  /**
   * List of tile coordinates that are not passable by this tile.
   *
   *     var tiles = Hiraya.Tiles.create();
   *     tile = tiles.get(0, 0);
   *     tile.set('walls', [
   *       [1, 0],
   *       [0, 1]
   *     ]);
   *     tile.blocked(tiles.get(1, 0)); //-> true
   *     tile.blocked(tiles.get(0, 1)); //-> true
   *     tile.blocked(tiles.get(1, 1)); //-> false
   *
   * @property walls
   * @type {Array}
   */
  walls: null,

  /**
   * The value of the tile.
   *
   * @property cost
   * @type {Number}
   * @default -1
   */
  cost: null,

  /**
   * List of entities occupying this tile
   *
   * @property entities
   * @type {Array}
   */
  entities: null,

  /**
   * Returns the score of the tile used in the a-star algorithm.
   *
   * @method val
   * @returns {Number} score
   */
  val: function() {
    return this.entities.length || this.isWall ? 1000 : 1;
  },

  init: function() {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.cost = -1;
    this.parent = null;
    this.type = null;
    this.entities = [];
  },

  /**
   * Returns a simplified JSON format of this tile that returns the x, y and z property
   *
   * @method json
   * @returns {Object} json
   */
  json: function() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  },

  /**
   * Instructs the tile to let the entity occupy it.
   *
   * @method occupy
   * @param {Entity} entity
   */
  occupy: function(entity) {
    if (!this.has(entity)) {
      this.entities.push(entity);
      entity.set('tile', this);
    }
  },

  /**
   * Checks if the entitiy exists in this tile
   *
   * @method has
   * @param {Entity} entity
   * @returns Boolean 
   */
  has: function(entity) {
    return this.entities.indexOf(entity) > -1;
  },

  /**
   * Removes the entity from the tile
   *
   * @method vacate
   * @param {Entity} entity
   * @chainable
   */
  vacate: function(entity) {
    if (this.has(entity)) {
      entity.set('tile', null);
      this.entities.splice(this.entities.indexOf(entity), 1);
    }
    return this;
  },

  /**
   * Tells if the tile is occupied by entities.
   *
   * @method isOccupied
   * @returns Boolean
   */
  isOccupied: function() {
    return this.entities.length > 0;
  },

  /**
   * Tells if the tile has no occupants in it
   *
   * @method isEmpty
   * @returns Boolean
   */
  isEmpty: function() {
    return this.entities.length === 0;
  },

  /**
   * Checks if the target tile is an element of the `.walls` array.
   *
   * @method blocked
   * @param {Hiraya.Tile} tile
   * @returns {Boolean}
   */
  blocked: function(tile) {
    var x = tile.x,
        y = tile.y,
        wall, blocked;
    if (this.walls && this.walls.length) {
      for (var i = this.walls.length - 1; i >= 0; i--){
        wall = this.walls[i];
        if (wall[0] == x && wall[1] === y) {
          blocked = true;
          break;
        }
      }
    }
    return blocked;
  },

  nearest: function(list) {
    var distances = [];
    var tiles = [];
    for(var i=0,len=list.length; i<len; i++) {
      var tile = list[i];
      var distance = Math.abs(tile.x + tile.y - this.x - this.y);
      var index = 0;
      for(var ii=0,llen=distances.length; ii<llen; ii++) {
        if (distance < distances[ii]) {
          index = ii;
          break;
        }
      }
      distances.splice(index, 0, distance);
      tiles.splice(index, 0, tile);
    }
    return tiles[0];
  }
});

module.exports = Tile;

},{"../hiraya-core/class":2}],11:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Class = require('../hiraya-core/class');
var Tile = require('./tile');

/**
 * `Hiraya.Tiles` manages `Hiraya.Tile` instances which includes selecting neighbors and path-finding.
 *
 * @class Tiles
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Tiles = Class.extend({
  /**
   * Total number of columns of the board.
   *
   * @property columns
   * @type {Number}
   * @default 8
   */
  columns: 8,

  /**
   * Total number of rows of the board.
   *
   * @property rows
   * @type {Number}
   * @default 8
   */
  rows: 8,

  /**
   * The matrix for the list of array for easy reference. Internal use only.
   *
   * @property _matrix
   * @type {Array}
   * @private
   */
  _matrix: null,

  /**
   * The total number of tiles.
   *
   * @property _total
   * @type {Number}
   * @private
   */
  _total: null,

  /**
   * The default Tile class to be instantiated when the board generates tiles.
   *
   * @property Tile
   * @type {Hiraya.Tile}
   * @default Hiraya.Tile
   */
  Tile: Tile,
  init: function() {
    this._generate();
  },

  /**
   * Generates the board with tiles
   *
   * @method _generate
   * @private
   */
  _generate: function() {
    this._matrix = [];
    this._total = 0;
    for(var countY = 0; countY < this.rows; countY++) {
      this._matrix.push([]);
      for(var countX = 0; countX < this.columns; countX++) {
        var tile = this.Tile.create({
          x: countX,
          y: countY,
          z: this._total
        });
        this._matrix[countY].push(tile);
        this._total++;
      }
    }
  },

  /**
   * Retrieves a tile based on its x and y coordinates
   *
   * @method get
   * @param {Number} x
   * @param {Number} y
   * @returns {Tile}
   */
  get: function(x, y) {
    var t;
    if ((t = this._matrix[y])) {
      if ((t = t[x])) {
        return t;
      }
    }
    return t;
  },

  /**
   * Retrieves the adjacent tiles of a tile.
   *
   * @method adjacent
   * @param {Hiraya.Tile} tile
   * @returns {Array}
   */
  adjacent: function(tile) {
    var t, adjacent;
    adjacent = [];
    if ((t = this.get(tile.x - 1, tile.y - 1))) { /** NW **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x, tile.y - 1))) { /** N **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x + 1, tile.y - 1))) { /** NE **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x - 1, tile.y))) { /** E **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x + 1, tile.y))) { /** W **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x - 1, tile.y + 1))) { /** SW **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x, tile.y + 1))) { /** S **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x + 1, tile.y + 1))) { /** SE **/
      adjacent.push(t);
    }
    return adjacent;
  },

  /**
   * Find the movement cost between two tiles. Internal use only.
   *
   * @method _movementCost
   * @param {Hiraya.Tile} start
   * @param {Hiraya.Tile} end
   * @private
   * @returns {Boolean}
   */
  _movementCost: function(start, end) {
                   //return end.entities.length || end.wall ? 10000 : end.val();
    return end.wall ? 10000 : end.val();
  },

  /**
   * Performs an A-star pathfinding algorithm
   *
   * @method path
   * @param {Hiraya.Tile} start
   * @param {Hiraya.Tile} end
   * @returns {Array}
   */
  path: function(start, end) {
    var openList,
    closedList,
    currentNode,
    neighbors,
    neighbor,
    scoreG,
    scoreGBest,
    i,
    _len;
    openList = [start];
    closedList = [];

    while(openList.length) {
      var lowestIndex = 0;
      for(i=0,_len = openList.length; i < _len; i++) {
        if (openList[i].f < openList[lowestIndex].f) {
          lowestIndex = i;
        }
      }
      currentNode = openList[lowestIndex];
      // case END: The result has been found.
      if (currentNode.x === end.x && currentNode.y === end.y) {
        var current = currentNode;
        var parent;
        var tiles = [];
        while (current.parent) {
          tiles.push(current);
          parent = current.parent; // capture the parent element.
          current.parent = null; // clear the tile's parent
          current = parent; // move to the next parent
        }
        return tiles.reverse();
      }
      // case DEFAULT: Move current node to the closed list.
      openList.splice(currentNode, 1);
      closedList.push(currentNode);
      // Find the best score in the neighboring tile of the hex.
      neighbors = this.adjacent(currentNode);
      for(i=0, _len = neighbors.length; i < _len; i++) {
        neighbor = neighbors[i];
        if (closedList.indexOf(neighbor) > -1 || neighbor.wall || neighbor.isOccupied() /** || currentNode.blocked(neighbor) || neighbor.blocked(currentNode) **/ ) {
          continue;
        }
        scoreG = currentNode.g + 1;
        scoreGBest = false;
        // if it's the first time to touch this tile.
        if(openList.indexOf(neighbor) === -1) {
          scoreGBest = true;
          neighbor.h = this.heuristic(neighbor, end);
          openList.push(neighbor);
        } else if (scoreG < neighbor.g) {
          scoreGBest = true;
        }
        if (scoreGBest) {
          neighbor.parent = currentNode;
          neighbor.g = scoreG;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
    return [];
  },

  /**
   * Retrives a list of tiles by radius
   *
   * @method range
   * @param {Hiraya.Tile} tile
   * @param {Number} [radius=1]
   * @param {Boolean} [ignoreCost=false]
   * @returns {Array}
   */
  range: function(tile, radius, ignoreCost) {
    var open = [tile];
    var closed = [];
    var currTile;
    var adjacent;
    var neighbor, newCost, i, _len, tileCost;

    if (radius === undefined) {
      radius = 1;
    }

    while(open.length > 0) {
      currTile = open.pop();
      closed.push(currTile);
      if (currTile.cost < radius) {
        adjacent = this.adjacent(currTile);
        _len = adjacent.length;
        for(i = 0; i < _len; i++) {
          neighbor = adjacent[i];
          tileCost = ignoreCost ? 1 : this._movementCost(currTile, neighbor);
          newCost = currTile.cost + tileCost;
          if (neighbor.blocked(currTile) || currTile.blocked(neighbor)) {
            continue;
          }
          if (neighbor.cost === -1 || newCost < neighbor.cost) {
            neighbor.cost = newCost;
            if (open.indexOf(neighbor) === -1) {
              open.push(neighbor);
            }
          }
        }
      }
    }

    var results = [];
    for(i=0,_len=closed.length; i < _len; i++) {
      currTile = closed[i];
      if (currTile.cost < radius) {
        if (results.indexOf(currTile) === -1) {
          results.push(currTile);
        }
      }
      currTile.cost = -1;
    }
    return results;
  },

  /**
   * Used to calculate the heuristics for the path-finding algorithm
   *
   * @method heuristic
   * @param {Hiraya.Tile} start
   * @param {Hiraya.Tile} destination
   * @param {Number} [cost=1]
   * @returns {Number}
   */
  heuristic: function(start, destination, cost) {
    var vectorX, vectorY;
    if (cost === null) {
      cost = 1;
    }
    vectorX = Math.pow(start.x - destination.x, 2);
    vectorY = Math.pow(start.y - destination.y, 2);
    return Math.sqrt(vectorX + vectorY);
  }

});

module.exports = Tiles;

},{"../hiraya-core/class":2,"./tile":10}],12:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Tiles = require('./tiles');

/**
 * `Hiraya.TilesHex` is the hex-version of `Hiraya.Tile`. It contains a different method of finding neighbors.
 *
 * @class TilesHex
 * @extends Hiraya.Tiles
 * @namespace Hiraya
 */
var TilesHex = Tiles.extend({
  /**
   * @property EAST
   * @type {String}
   * @static
   */
  EAST: 'east',

  /**
   * @property WEST
   * @type {String}
   * @static
   */
  WEST: 'west',

  /**
   * @property SOUTHEAST
   * @type {String}
   * @static
   */
  SOUTHEAST: 'southEast',

  /**
   * @property NORTHEAST
   * @type {String}
   * @static
   */
  NORTHEAST: 'northEast',

  /**
   * @property SOUTHWEST
   * @type {String}
   * @static
   */
  SOUTHWEST: 'southWest',

  /**
   * @property NORTHWEST
   * @type {String}
   * @static
   */
  NORTHWEST: 'northWest',

  /**
   * Calculates the adjacent x coordinate based on index and radius
   * @param {string} direction
   * @param {boolean} isOddRow
   * @param {number} index
   * @param {number} i
   * @return {Number}
   */
  deltaX: function(direction, isOddRow, index, i) {
    var result;
    if (index === null) {
      index = 1;
    }
    if (i === null) {
      i = 0;
    }
    result = 0;
    switch (direction) {
      case this.EAST:
        result += (isOddRow ? Math.floor(i * 0.5) * -1 : Math.ceil(i * 0.5) * -1) + index;
      break;
      case this.WEST:
        result += (isOddRow ? Math.ceil(i * 0.5) : Math.floor(i * 0.5)) - index;
      break;
      case this.SOUTHEAST:
        result += (isOddRow ? Math.ceil(index * 0.5) : Math.floor(index * 0.5)) - i;
      break;
      case this.NORTHEAST:
        result += Math.floor(index * 0.5) + i - Math.floor(i * 0.5);
      if (isOddRow) {
        if (index % 2 && (index + i) % 2) {
          result++;
        }
      } else {
        if (index % 2 === 0 && (index + i) % 2) {
          result--;
        }
      }
      break;
      case this.SOUTHWEST:
        result -= Math.ceil(index * 0.5) + i - Math.ceil(i * 0.5);
      if (isOddRow) {
        if (index % 2 && (index + i) % 2) {
          result++;
        }
      } else {
        if (index % 2 === 0 && (index + i) % 2) {
          result--;
        }
      }
      break;
      case this.NORTHWEST:
        result += (isOddRow ? Math.ceil(index * -0.5) : Math.floor(index * -0.5)) + i;
    }
    return result;
  },

  /**
   * Calculates the adjacent y coordinate based on index and radius
   * @param {string} direction
   * @param {boolean} isOddRow
   * @param {number} index
   * @param {number} i
   * @return {Number}
   */
  deltaY: function(direction, isOddRow, index, i) {
    var result;
    if (index === null) {
      index = 1;
    }
    if (i === null) {
      i = 0;
    }
    result = 0;
    switch (direction) {
      case this.EAST:
        result += i;
      break;
      case this.WEST:
        result += i * -1;
      break;
      case this.SOUTHEAST:
        result += index;
      break;
      case this.SOUTHWEST:
        result += index - i;
      break;
      case this.NORTHEAST:
        result += (index * -1) + i;
      break;
      case this.NORTHWEST:
        result += index * -1;
    }
    return result;
  },

  /**
   * Returns the delta of a coordinate based on the direction
   * @param {number} centerX
   * @param {number} centerY
   * @param {string} direction
   * @param {boolean} isOddRow
   * @param {number} index
   * @return {Array}
   */
  delta: function(centerX, centerY, direction, isOddRow, index) {
    var i, result, tile, dx, dy;
    result = [];
    for (i = 1; 1 <= index ? i <= index : i >= index; 1 <= index ? i++ : i--) {
        dx = centerX + this.deltaX(direction, isOddRow, index, i - 1);
        dy = centerY + this.deltaY(direction, isOddRow, index, i - 1);
        tile = this.get(dx, dy);
        if (tile) {
            result.push(tile);
        }
    }
    return result;
  },

  /**
   * Gets the adjacent neighbors in a hex-like environment
   * @param {object} tile
   * @param {number} [radius=1]
   * @return {Array}
   */
  adjacent: function(tile, radius) {
    var centerX, centerY, east, i, isOddRow, result, northEast, northWest, southEast, southWest, west;
    if (typeof radius !== 'number') {
      radius = 1;
    }
    centerX = tile.x;
    centerY = tile.y;
    result = [];
    isOddRow = centerY % 2 > 0;
    if (radius > 0) {
      for (i = 1; 1 <= radius ? i <= radius : i >= radius; 1 <= radius ? i++ : i--) {
        east = this.delta(centerX, centerY, this.EAST, isOddRow, i);
        result = result.concat(east);
        west = this.delta(centerX, centerY, this.WEST, isOddRow, i);
        result = result.concat(west);
        southEast = this.delta(centerX, centerY, this.SOUTHEAST, isOddRow, i);
        result = result.concat(southEast);
        northEast = this.delta(centerX, centerY, this.NORTHEAST, isOddRow, i);
        result = result.concat(northEast);
        southWest = this.delta(centerX, centerY, this.SOUTHWEST, isOddRow, i);
        result = result.concat(southWest);
        northWest = this.delta(centerX, centerY, this.NORTHWEST, isOddRow, i);
        result = result.concat(northWest);
      }

    }

    return result;
  }
});

module.exports = TilesHex;

},{"./tiles":11}],13:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */


var GetterSetter = require('../hiraya-core/getter-setter');
var Collection = require('../hiraya-core/collection');
var Entity = require('./entity');
var Tiles = require('./tiles');
var Command = require('./command');

/**
 * `Hiraya.Level` manages the game logic and entity interaction.
 *
 * ### Events
 *
 * - `addedEntity`
 *
 * @class Level
 * @extends Hiraya.GetterSetter
 * @namespace Hiraya
 */
var Level = GetterSetter.extend({
  /**
   * @property entities
   * @type {Hiraya.Collection}
   */
  entities: null,

  /**
   * The Entity class for this level
   * @property Entity
   * @type {Hiraya.Entity}
   */
  Entity: Entity,

  /**
   * Dictionary of all the entities in this level
   * @property _entityIDs
   * @type {Object}
   * @private
   */
  _entityIDs: {},

  /**
   * The Tiles class for this level
   * @property Tiles
   * @type {Hiraya.Tiles}
   */
  Tiles: Tiles,

  /**
   * Initialization
   * @method init
   */
  init: function() {
    this.tiles = this.Tiles.create();
    this.entities = Collection.create();
    this._super();
    this.ready();
  },

  /**
   * Emitted after initialization
   *
   * @event ready
   */
  ready: function() {
    this.emit('event', 'ready');
  },

  /**
   * Adds an entity into the collection.
   *
   * Following is an example format:
   *
   *     var entity = level.createEntity({
   *       name: 'Swordsman',
   *       stats: {
   *         health: [500, 1000] // value, max
   *         attack: [100] // value, max
   *       }
   *     });
   *     level.addEntity(entity);
   *
   * @method addEntity
   * @param {Hiraya.Entity} entity
   * @chainable
   */
  addEntity: function(entity) {
    // attributes.stats gets overwritten in library
    this.entities.add(entity);
    this.addedEntity(entity);
    this.emit('event', 'addedEntity', entity);
    if (entity.id) {
      this._entityIDs[entity.id] = entity;
    }
    return this;
  },

  /**
   * Removes an entity from the level.
   *
   * @method removeEntity
   * @param {Hiraya.Entity} entity
   * @chainable
   */
  removeEntity: function(entity) {
    if (entity) {
      this.entities.remove(entity);
      if (this._entityIDs[entity.id] === entity) {
        delete this._entityIDs[entity.id];
      }
    }
    return this;
  },

  /**
   * Retrieves an entity based on ID
   *
   * @method getEntity
   * @param {String} id
   */
  getEntity: function(id) {
    return this._entityIDs[id];
  },

  /**
   * Creates a `Hiraya.Entity` from a class. Use this to override the classname you wish to use.
   *
   * @method createEntity
   * @param {Object} attributes
   * @returns Hiraya.Entity
   */
  createEntity: function(attributes) {
    // create a clone of the attribute object
    var clone = JSON.parse(JSON.stringify(attributes));
    var stats = attributes.stats;
    var tile = attributes.tile;

    delete clone.stats;
    delete clone.tile;
    var entity = this.Entity.create(clone);

    // attribute parsing
    if (attributes) {
      // parse stats
      if (stats) {
        for (var key in stats) {
          if (stats.hasOwnProperty(key)) {
            var stat = stats[key];
            entity.stats.set(key, stat[0], stat[1]);
          }
        }
      }
      // parse tile position of the entity
      if (tile) {
        var entityTile = this.tiles.get(tile.x, tile.y);
        if (entityTile) {
          entityTile.occupy(entity);
        }
      }
    }

    return entity;
  },

  /**
   * Moves an entity to a tile in the level.
   *
   * @method moveEntity
   * @param {Hiraya.Entity} entity
   * @param {Object} position
   */
  moveEntity: function(entity, position) {
    var tile = this.tiles.get(position.x, position.y);
    if (!tile) return;
    // emit a movingEntity event hook
    this.movingEntity(entity, entity.tile, tile);
    // make sure to vacate the entity from the tile first
    var prevTile = entity.tile;
    if (prevTile) prevTile.vacate(entity);
    // occupy the tile
    tile.occupy(entity);
    this.movedEntity(entity, tile, prevTile);
  },

  /**
   * Instructs the entity to make an action to another entity.
   *
   * @method actEntity
   * @param {Hiraya.Entity} entity
   */
  actEntity: function(entity, targetEntity) {
    var command = Command.create({
      damage: entity.stats.attack.value,
      name: 'attack'
    });
    this.actingEntity(entity, targetEntity, command);
    entity.attack(targetEntity);
    this.actedEntity(entity, targetEntity, command);
  },

  /**
   * When an entity is added.
   *
   * @event addedEntity
   * @param {Hiraya.Entity} entity
   */
  addedEntity: function(entity) {
  },

  /**
   * When an entity has moved
   *
   * @event movedEntity
   * @param {Hiraya.Entity} entity The entity in question
   * @param {Hiraya.Tile} tile tile that the entity has moved
   * @param {Hiraya.Tile} prevTile previous tile before it was moved
   */
  movedEntity: function(entity, tile, prevTile) {
    this.emit('event', 'movedEntity', entity, tile, prevTile);
  },

  /**
   * When an entity is beginning to move
   *
   * @event movingEntity
   * @param {Hiraya.Entity} entity The entity in question
   * @param {Hiraya.Tile} startTile tile that the entity will start from
   * @param {Hiraya.Tile} endTile tile that the entity will go to
   */
  movingEntity: function(entity, startTile, endTile) {
    this.emit('event', 'movingEntity', entity, startTile, endTile);
  },

  /**
   * @event actingEntity
   * @param {Hiraya.Entity} entity
   * @param {Hiraya.Entity} targetEntity
   * @param {Hiraya.Command} command
   */
  actingEntity: function(entity, targetEntity, command) {
    this.emit('event', 'actingEntity', entity, targetEntity, command);
  },

  /**
   * @event actedEntity
   * @param {Hiraya.Entity} entity
   * @param {Hiraya.Entity} targetEntity
   * @param {Hiraya.Command} command
   */
  actedEntity: function(entity, targetEntity, command) {
    this.emit('event', 'actedEntity', entity, targetEntity, command);
  }


});

module.exports = Level;

},{"../hiraya-core/getter-setter":21,"../hiraya-core/collection":4,"./entity":8,"./tiles":11,"./command":15}],14:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */


var Level = require('./level');
var EntityTurnBased = require('./entity-turnbased');

/**
 * `Hiraya.LevelTurnBased` manages entities and game logic for turn-based games.
 *
 * ### Events
 *
 * - `getTurnTimedOut`
 * - `gotTurn`
 * - `hasNoWinnerYet`
 * - `hasWinner`
 *
 * @class LevelTurnBased
 * @extends Hiraya.Level
 * @namespace Hiraya
 */
var LevelTurnBased = Level.extend({
  Entity: EntityTurnBased,

  /**
   * Determines how fast the tick for the turn calculation will be.
   *
   * @property tickSpeed
   * @type {Number}
   * @default 1
   */
  tickSpeed: 1,

  /**
   * Determines the number of tries the `.getTurn()` function can do before
   * giving up.
   *
   * @property _maxGetTurnAttempts
   * @type {Number}
   * @private
   * @default 25
   */
  _maxGetTurnAttempts: 25,

  /**
   * Finds the next entity to take its turn.
   *
   * @method getTurn
   */
  getTurn: function() {
    var entity, _this = this;
    var tries = 0;
    var maxTries = this._maxGetTurnAttempts;
    var tick = function() {
      entity = _this._getEntityTurn();
      tries++;
      if (!entity) {
        if (tries < maxTries) {
          setTimeout(tick, _this.tickSpeed);
        } else {
          _this.getTurnTimedOut();
        }
      } else {
        entity.stats.turn.empty();
        _this.gotTurn(entity);
      }
    };
    tick();
  },

  /**
   * Increases the entities' turn stat by 1 and returns an entity if it has reached its max turn stat value
   *
   * @method _getEntityTurn
   * @private
   * @returns Hiraya.EntityTurnBased
   */
  _getEntityTurn: function() {
    var total = this.entities.length;
    var entity;
    var result;
    for(var i=0; i<total; i++) {
      entity = this.entities.at(i);
      entity.stats.turn.add(entity.stats.turnspeed.value);
      if (entity.stats.turn.isMax()) {
        result = entity;
        break;
      }
    }
    return result;
  },

  /**
   * Checks to see if there is already a winning entity in the game.
   *
   * @method evaluateEntities
   * @returns null
   */
  evaluateEntities: function() {
    var enabled = [];
    var disabled = [];
    this.entities.each(function(entity) {
      if (entity.stats.health.isEmpty()) {
        disabled.push(entity);
      } else {
        enabled.push(entity);
      }
    });
    if (enabled.length <= 1) {
      this.hasWinner(enabled[0]);
    } else {
      this.hasNoWinnerYet();
    }
  },

  /**
   * Finds the nearest entities based on closed proximity.
   *
   * @method promixity
   * @param {Hiraya.EntityTurnBased} entity
   * @param {String} [by=null]
   * @returns {Array}
   */
  proximity: function(entity, by) {
    var distances = [],
      entities = [],
      tiles,
      radius = Math.floor(this.tiles.columns * 0.5)
    ;
    if (by === 'range') {
      radius = entity.stats.range.value;
    }
    tiles = this.tiles.range(entity.tile, radius, true);
    for(var i=0,len=tiles.length; i<len; i++) {
      var tile = tiles[i];
      var occupant = tile.entities[0];
      if (occupant && occupant !== entity) {
        if (occupant.stats.health.isEmpty()) {
          continue;
        }
        var distance = Math.abs(occupant.tile.x - entity.tile.x + occupant.tile.y - entity.tile.y);
        var index = 0;
        for(var ii=0, llen=distances.length; ii<llen; ii++) {
          if (distance < distances[ii]) {
            index = ii;
            break;
          }
        }
        distances.splice(index, 0, distance);
        entities.splice(index, 0, occupant);
      }
    }
    return entities;
  },

  /**
   * Gets the nearest tile of an entity from a tile. Basic path finding helper in finding
   *
   * @method nearestEntityTileFrom
   * @param {Hiraya.Entity} entity
   * @returns {Hiraya.Tile}
   */
  nearestEntityTileFrom: function(entity, tile) {
    var proximity = this.proximity(entity);
    var target = proximity[0];
    var nearest;
    if (target) {
      nearest = entity.tile.nearest(this.tiles.adjacent(target.tile));
    }
    return nearest;
  },

  /**
   * Fired when an entity reaches its max `.stats.turnspeed` value.
   *
   * @event gotTurn
   * @param {Hiraya.EntityTurnBased} entity
   */
  gotTurn: function(entity) {
  },

  /**
   * Fired when a winner has been announced after performing a `.evaluateEntities()` function.
   *
   * @event hasWinner
   * @param {Hiraya.EntityTurnBased} entity
   */
  hasWinner: function(entity) {
  },

  /**
   * Fired when there is no winner yet after performing a `.evaluateEntities()` function.
   *
   * @event hasNoWinnerYet
   */
  hasNoWinnerYet: function() {
  },

  /**
   * Fired when attempts in finding an entity to take its turn has reached its maximum number of tries.
   *
   * @event getTurnTimedOut
   */
  getTurnTimedOut: function() {
  }
});


module.exports = LevelTurnBased;

},{"./level":13,"./entity-turnbased":7}],16:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-view
 */

var Emitter = require('../hiraya-core/emitter');
var createjs = typeof window === 'object' ? window.createjs : {};

/**
 * Canvas manages the stage and all things happening in them.
 *
 * @class Canvas
 * @extends Hiraya.Emitter
 * @namespace Hiraya
 */
var Canvas = Emitter.extend({
  /**
   * The ID selector of the canvas container element.
   *
   * @property id
   * @type {String}
   * @default hg-canvas
   */
  id: 'hg-canvas',

  /**
   * Width of the canvas
   *
   * @property width
   * @type {Number}
   * @default 900
   */
  width: 900,

  /**
   * Height of the canvas
   *
   * @property height
   * @type {Number}
   * @default 500
   */
  height: 500,

  /**
   * Frame rate setting for this canvas.
   *
   * @property fps
   * @type {Number}
   * @default 30
   */
  fps: 30,

  /**
   * The `createjs.Stage` instance.
   *
   * @property _stage
   * @type {createjs.Stage}
   * @private
   */
  _stage: null,


  /**
   * The createjs.Ticker static class
   *
   * @property _ticker
   * @type {createjs.Ticker}
   * @private
   */
  _ticker: null,

  /**
   * `Hiraya.Level` instance that is given by the Game object.
   *
   * @property level
   * @type {Hiraya.Level}
   */
  level: null,

  /**
   * A bridge between the canvas and `createjs.Tween`
   *
   * @property Tween
   * @type {createjs.Tween}
   */
  Tween: null,

  /**
   * A bridge between the canvas and `createjs.Ease`
   *
   * @property Ease
   * @type {createjs.Ease}
   */
  Ease: null,


  /**
   * The layer structure of the canvas. Useful for separating tiles, sprites, foreground
   * and background to name a few. Layer names listed in order will be generated accordingly.
   *
   *     Hiraya.Canvas.extend({
   *      layers: [
   *        'background',
   *        'tiles',
   *        'sprites',
   *        'foreground'
   *      ];
   *     })
   *
   *
   * @property layers
   * @type {Array}
   */
  layers: [
    'ground',
    'tiles',
    'sprites',
    'foreground'
  ],

  /**
   * @property sprites
   * @type {Array}
   */
  sprites: [],

  init: function() {
    // add the canvas element to the DOM tree
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.id = this.id;
    document.body.appendChild(canvas);
    this._stage = new createjs.Stage(canvas);
    this._ticker = createjs.Ticker;
    this.Tween = createjs.Tween;
    this.Ease = createjs.Ease;

    var stage = this._stage;
    var ticker = this._ticker;

    // generate the layers
    if (this.layers && typeof this.layers.forEach === 'function') {
      this.layers.forEach(function(layerName, i) {
        var layer = new createjs.Container();
        layer.name = layerName;
        stage.addChild(layer);
      });
    }

    // setup event listeners
    ticker.addEventListener('tick', this.render.bind(this));
    stage.addEventListener('stagemousedown', this.mouseDown.bind(this));
    stage.addEventListener('stagemouseup', this.mouseUp.bind(this));
    stage.addEventListener('stagemousemove', this.mouseMove.bind(this));

    // set the frame rate
    ticker.setFPS(this.fps);
    this.ready();
  },

  /**
   * eauses the canvas rendering
   *
   * @method pause
   * @chainable
   */
  pause: function() {
    this._ticker.setPaused(true);
  },

  /**
   * Resumes the canvas rendering
   *
   * @method resume
   * @chainable
   */
  resume: function() {
    this._ticker.setPaused(false);
  },

  /**
   * @event mouseUp
   */
  mouseUp: function(event) {
  },

  /**
   * @event mouseDown
   */
  mouseDown: function(event) {
  },

  /**
   * @event mouseMove
   */
  mouseMove: function(event) {
  },


  /**
   * When the canvas is ready for action.
   * @event ready
   */
  ready: function() {
  },

  /**
   * Renders the canvas operation.
   *
   * @method render
   * @private
   */
  render: function(event) {
    if (event && event.paused) return;
    this._stage.update();
    this.update();
  },

  /**
   * Event hook for subscribing to a tick event.
   * @event update
   */
  update: function() {
  },

  /**
   * Adds a createjs.BitmapAnimation object to a layer.
   *
   * @param {String} layerName
   * @param {createjs.BitmapAnimation} animation
   * @chainable
   */
  addToLayer: function(layerName, animation) {
    var layer = this.getLayer(layerName);
    if (layer) {
      layer.addChild(animation);
    }
    return this;
  },

  /**
   * Caches the graphical state of the layer to improve performance.
   * Note: You will need to uncache the layer to be able to see
   * the graphical updates of the children within it.
   *
   * @method cacheLayer
   * @param {String} layerName 
   * @param {Number} width
   * @param {Number} height
   * @chainable
   */
  cacheLayer: function(layerName, width, height) {
    var layer = this.getLayer(layerName);
    if (layer) {
      layer.cache(0, 0, width, height);
    }
    return this;
  },

  /**
   * Uncaches the graphical state of the layer made via the `cacheLayer` method.
   *
   * @method uncacheLayer 
   * @param {String} layerName 
   * @chainable
   */
  uncacheLayer: function(layerName) {
    var layer = this.getLayer(layerName);
    if (layer) {
      layer.uncache();
    }
    return this;
  },


  /**
   * An event hook when the level is object is ready.
   *
   * @param {Hiraya.Level} level
   * @event levelReady
   */
  levelReady: function(level) {
    level.on('event', this._levelEvent.bind(this));
    if (this.levelEvents.ready) {
      this.levelEvents.ready.call(this, level);
    }
  },

  /**
   * A dictionary of event hooks
   *
   * @property levelEvents
   * @type {Object}
   */
  levelEvents: {},

  /**
   * Callback for the level events
   *
   * @method _levelEvent
   * @param {String} type
   * @private
   */
  _levelEvent: function(type) {
    var event = this.levelEvents[type];
    if (event) {
      event.apply(this, Array.prototype.slice.call(arguments, 1)); // cut out the type argument
    }
  },

  /**
   * Gets the layer from the stage.
   *
   * @param {String} layername
   * @return createjs.Container
   */
  getLayer: function(layerName) {
    return this._stage.getChildByName(layerName);
  },

  /**
   * Creates a static image derived from a sprite sheet.
   *
   * @method createStaticBitmapAnimation
   * @param {Object} frameData
   * @param {String} targetFrameLabel
   * @return createjs.BitmapAnimation
   */
  createStaticBitmapAnimation: function(frameData, targetFrameLabel) {
    var spriteSheet = new createjs.SpriteSheet(frameData);
    var animation = new createjs.BitmapAnimation(spriteSheet);
    animation.gotoAndStop(targetFrameLabel);
    return animation;
  },

  /**
   * Current panned x value of the canvas
   *
   * @property _x
   * @type {Number}
   * @default 0
   * @private
   */
  _x: 0,

  /**
   * Current panned y value of the canvas
   *
   * @property _y
   * @type {Number}
   * @default 0
   * @private
   */
  _y: 0,

  /**
   * Pans the entire layer tree.
   *
   * @method pan
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  pan: function(x, y) {
    var layers = this.layers;
    this._x = x;
    this._y = y;
    for(var i=0; i<layers.length; i++) {
      var layer = this.getLayer(layers[i]);
      if (layer) {
        if (typeof x === 'number') layer.x = x;
        if (typeof y === 'number') layer.y = y;
      }
    }
  },

  /**
   * Pans the x axis of the layers in the canvas.
   *
   * @method panX
   * @param {Number} x
   * @chainable
   */
  panX: function(x) {
    var layers = this.layers;
    this._x = x;
    for(var i=0; i<layers.length; i++) {
      var layer = this.getLayer(layers[i]);
      if (layer) {
        layer.x = x;
      }
    }
  },

  /**
   * Pans the y axis of the layers in the canvas
   *
   * @method panY
   * @param {Number} y
   * @chainable
   */
  panY: function(y) {
    var layers = this.layers;
    this._y = y;
    for(var i=0; i<layers.length; i++) {
      var layer = this.getLayer(layers[i]);
      if (layer) {
        layer.y = y;
      }
    }
  },

  /**
   * Returns the current x value of the canvas pan
   *
   * @method x
   * @returns {Number}
   */
  x: function() {
    return this._x;
  },

  /**
   * Returns the current y value of the canvas pan
   *
   * @method y
   * @returns {Number}
   */
  y: function() {
    return this._y;
  },


  /**
   * Centers the board
   *
   * @method centerBoard
   */
  centerBoard: function() {
    var columns = this.level.tiles.columns;
    var rows = this.level.tiles.rows;
    var dimensions = Hiraya.HexagonUtil.dimensions(columns, rows);
    this.pan(this.width * 0.5 - dimensions.width * 0.5, this.height * 0.5 - dimensions.height * 0.5 + 50);
  },

  /**
   * Sorts the depth for the sprite with its associated tile as the argument.
   *
   * @method sortSpriteDepth
   * @param {Hiraya.Sprite} sprite
   * @param {Hiraya.Tile} tile
   */
  sortSpriteDepth: function(sprite, tile) {
    var layer = this.getLayer('sprites');
    if (!layer) return;
    if (!sprite) return;
    if (!tile || isNaN(tile.z)) return;
    layer.removeChild(sprite.view);
    sprite.view.z = tile.z;
    var length = layer.getNumChildren();
    for(var i=0; i<length; i++) {
      var child = layer.getChildAt(i);
      if (child.z >= sprite.view.z) {
        break;
      }
    }
    layer.addChildAt(sprite.view, i);
  }
});

module.exports = Canvas;

},{"../hiraya-core/emitter":3}],15:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Class = require('../hiraya-core/class');

/**
 * A class for creating commands for entities. Use this to construct
 * skills, abilities, etc.
 *
 * @class Command
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Command = Class.extend({
  /**
   * Name of the command
   *
   * @property name
   * @type {String}
   */
  name: null,

  /**
   * Base damage of this command
   *
   * @property damage
   * @type {Number}
   * @default 0
   */
  damage: 0

});

module.exports = Command;

},{"../hiraya-core/class":2}],17:[function(require,module,exports){
var createjs = typeof window === 'object' ? window.createjs : {};
/**
 * @module hiraya
 * @submodule hiraya-view
 */

/**
 * Canvas manages the stage and all things happening in them.
 *
 * @class Sprite
 * @extends Hiraya.Emitter
 * @namespace Hiraya
 */
var Emitter = require('../hiraya-core/emitter');
var Sprite = Emitter.extend({

  /**
   * The createjs.Tween bridge
   *
   * @property Tween
   * @type {createjs.Tween}
   */
  Tween: createjs.Tween,

  /**
   * The createjs.Ease bridge
   *
   * @property Ease
   * @type {createjs.Ease}
   */
  Ease: createjs.Ease,

  /**
   * Sprite sheet frameData for the createjs.SpriteSheet class.
   *
   * @property sheetData
   * @type {Object}
   */
  sheetData: null,

  /**
   * Image resource to be used for the sprite object.
   *
   * @property image
   * @type {Image}
   */
  image: null,

  /**
   * The display object container for the sprite sheet animation and image.
   *
   * @property view
   * @type {createjs.BitmapAnimation} 
   */
  view: null,

  /**
   * Walk speed animation of the sprite.
   *
   * @property walkSpeed
   * @type {Nimber}
   * @default 500
   */
  walkSpeed: 500,

  init: function() {
    this.view = new createjs.Container();
    if (this.name) {
      this.view.name = this.name;
    }

    if (typeof this.frameData === 'object') {
      var animation = new createjs.BitmapAnimation(new createjs.SpriteSheet(this.frameData));
      animation.name = 'animation';
      this.view.addChild(animation);
    }

    if (this.image instanceof Image) {
      var bitmap = new createjs.Bitmap(image);
      bitmap.name = 'image';
      this.view.addChild(bitmap);
    }

  },

  /**
   * Play the animation based on the key frame in the sprite's frame data.
   *
   * @method play
   * @param {String} frameLabel
   */
  play: function(frameLabel) {
    var animation = this.view.getChildByName('animation');
    if (animation) {
      animation.gotoAndPlay(frameLabel);
    }
  },

  /**
   * Set the x coordinate of this sprite
   *
   * @method x
   * @param {Number} x
   * @chainable
   */
  x: function(x) {
    this.view.x = x;
    return this;
  },

  /**
   * Set the y coordinate of this sprite
   *
   * @method y
   * @param {Number} y
   * @chainable
   */
  y: function(y) {
    this.view.y = y;
    return this;
  },

  /**
   * Sets the x and y coordinate of this sprite.
   * You can optionally pass an object with the x and y values.
   *
   *    var sprite = Hiraya.Sprite.create();
   *    sprite.pos({ x: 100, y: 100 });
   *
   *    // using it in conjunction with the hexagon util class
   *    sprite.pos(Hiraya.HexagonUtil.coordinates({ x: 100, y: 200 }));
   *
   * @method pos
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  pos: function(x, y) {
    if (typeof x === 'object') { // argument is being passed as an object coordinate
      this.x(x.x);
      this.y(x.y);
    } else {
      this.x(x);
      this.y(y);
    }
    return this;
  },

  /**
   * Flips the sprite to the left side
   *
   * @method faceLeft
   */
  faceLeft: function() {
    this.vector = -1;
    this.view.scaleX = Math.abs(this.view.scaleX) * this.vector;
  },

  /**
   * Flips the sprite to the right side
   *
   * @method faceRight
   */
  faceRight: function() {
    this.vector = 1;
    this.view.scaleX = Math.abs(this.view.scaleX) * this.vector;
  },

  /**
   * Seeks the frame animation label then stop.
   *
   * @method playStop
   * @param {String} frameLabel
   */
  playStop: function(frameLabel) {
    var animation = this.view.getChildByName('animation');
    if (animation) {
      animation.gotoAndStop(frameName);
    }
  },

  /**
   * Stop any animation.
   *
   * @method stop
   */
  stop: function() {
    var animation = this.view.getChildByName('animation');
    if (animation) {
      animation.stop();
    }
  },

  /**
   * An event hook that's fired when the sprite is added to the canvas.
   *
   * @event spawn
   *
   */
  spawn: function() {
  },

  /**
   * An event hook that's fired when the sprite starts moving.
   *
   * @event moveStart
   */
  moveStart: function() {
  },

  /**
   * An event hook that's fired when the sprite stops moving.
   *
   * @event moveEnd
   */
  moveEnd: function() {
  },

  /**
   * An event hook that's fired when the sprite starts attacking.
   * Optionally, the name of the attack can be passed here to
   * let the sprite know which animation to play.
   *
   * @event attackStart
   * @param {String} name
   */
  attackStart: function(name) {
  },

  /**
   * An event hook that's fired when this sprite is being targetted.
   * The command of the action is passed to let the sprite know if it should
   * perform certain animations based on the command attributes.
   *
   * For example, if the sprite is receiving a command that involves stealth, it
   * can optionally not perform a defend stance animation.
   *
   * @event defendStart
   * @param {Hiraya.Sprite} sprite the sprite performing an action on this unit.
   * @param {Hiraya.Command} command the command
   */
  defendStart: function(sprite, command) {
  },

  /**
   * An event hook that's fired when the sprite is done defending itself. The command
   * used for the attack is passed to let the sprite know if it should perform certain
   * animations based on command attributes.
   *
   * For example, if the sprite gets a command with stun attribute, the sprite
   * can optionally perform a "freezing" animation.
   *
   * @event defendEnd
   * @param {Hiraya.Sprite} sprite the sprite performing an action on this unit.
   * @param {Hiraya.Command} command the command
   */
  defendEnd: function(sprite, command) {
  },

  /**
   * When the sprite is damaged or being hit.
   * @event hit
   */
  hit: function() {
  }
});


module.exports = Sprite;

},{"../hiraya-core/emitter":3}],21:[function(require,module,exports){
/**
 * @module hiraya
 * @submodule hiraya-core
 */

var Emitter = require('./emitter');

/**
 * `Hiraya.GetterSetter` enables a setter and getter API which also dispatches
 * an event whenever a property has changed.
 *
 *     var cat = Hiraya.GetterSetter.create();
 *     cat.on('health', function(hp) {
 *       console.log('health has changed to',  hp);
 *     };)
 *     cat.set('health', 10); // health has changed to 10
 *     cat.get('health') //-> 10
 *
 * @class GetterSetter
 * @extends Hiraya.Emitter
 * @namespace Hiraya
 */
var GetterSetter = Emitter.extend({

  /**
   * Sets a property which emits an event with a topic name of the property
   * that has been dispatched.
   *
   * @method set
   * @param {String} key
   * @param {String} value
   * @chainable
   */
  set: function(key, value) {
    this[key] = value;
    this.emit(key, value);
    return this;
  },

  /**
   * Gets the value of the property.
   *
   * @method get
   * @param {String} key
   * @returns {String|Object|Array|Number}
   */
  get: function(key) {
    return this.hasOwnProperty(key) ? this[key] : null;
  }
});

module.exports = GetterSetter;

},{"./emitter":3}]},{},[1])
;