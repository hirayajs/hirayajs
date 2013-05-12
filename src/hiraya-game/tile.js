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

  z: null,

  /**
   * Determining if the tile is passable. Used in the A-star algorithm.
   *
   * @property wall
   * @type {Boolean}
   * @default false
   */
  wall: null,

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
    return this.entities.length || this.wall ? 1000 : 1;
  },

  init: function() {
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
    return this
  },

  /**
   * Tells if the tile is occupied by entities.
   *
   * @method isOccupied
   * @returns Boolean
   */
  isOccupied: function() {
    return this.entities.length > 0;
  }
});

module.exports = Tile;
