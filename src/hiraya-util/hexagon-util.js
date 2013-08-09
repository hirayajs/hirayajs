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
