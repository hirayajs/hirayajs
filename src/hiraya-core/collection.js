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
  }
});

module.exports = Collection;
