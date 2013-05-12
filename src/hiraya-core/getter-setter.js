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
