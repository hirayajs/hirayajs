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
      this[name] = Stat.create({
        name: name,
        value: value,
        max: maxValue
      });
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
