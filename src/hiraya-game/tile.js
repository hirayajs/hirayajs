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
    this.entities = [];
    this.cost = -1;
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
