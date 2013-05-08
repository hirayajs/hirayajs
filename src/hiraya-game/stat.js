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
