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
