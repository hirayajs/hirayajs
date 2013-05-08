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
 *     cat.set('hp', 10); // health has changed to 10
 *
 * @class GetterSetter
 * @extends Hiraya.Emitter
 * @namespace Hiraya
 */
var GetterSetter = Emitter.extend({
  set: function(key, value) {
    this[key] = value;
    this.emit(key, value);
  },
  get: function(key) {
    return this.hasOwnProperty(key) ? this[key] : null;
  }
});

module.exports = GetterSetter;
