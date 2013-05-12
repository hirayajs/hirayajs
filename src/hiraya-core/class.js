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
  var parent = BaseClass.prototype;
  start = false;
  var prototype = new BaseClass();
  start = true;
  var attribute;
  // iterate over the properties and copy them.
  for(var name in properties) {
    if (properties.hasOwnProperty(name)) {
      attribute = properties[name];
      prototype[name] = typeof parent[name] === 'function' &&
        typeof attribute === 'function' &&
        // check if it's a Class by checking its list of prototype properties
        // no super should be assigned if ever.
        !isClassObject(attribute) ? // make sure we're assigning a proto parent only for functions
        protoParent(parent, name, attribute) :
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
