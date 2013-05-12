/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Class = require('../hiraya-core/class');
var Tile = require('./tile');

/**
 * `Hiraya.Tiles` manages `Hiraya.Tile` instances which includes selecting neighbors and path-finding.
 *
 * @class Tiles
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Tiles = Class.extend({
  /**
   * Total number of columns of the board.
   *
   * @property columns
   * @type {Number}
   * @default 8
   */
  columns: 8,

  /**
   * Total number of rows of the board.
   *
   * @property rows
   * @type {Number}
   * @default 8
   */
  rows: 8,

  /**
   * The matrix for the list of array for easy reference. Internal use only.
   *
   * @property _matrix
   * @type {Array}
   * @private
   */
  _matrix: null,

  /**
   * The total number of tiles.
   *
   * @property _total
   * @type {Number}
   * @private
   */
  _total: null,

  /**
   * The default Tile class to be instantiated when the board generates tiles.
   *
   * @property Tile
   * @type {Hiraya.Tile}
   * @default Hiraya.Tile
   */
  Tile: Tile,
  init: function() {
    this._generate();
  },

  /**
   * Generates the board with tiles
   *
   * @method _generate
   * @private
   */
  _generate: function() {
    this._matrix = [];
    this._total = 0;
    for(var countY = 0; countY < this.rows; countY++) {
        this._matrix.push([]);
        for(var countX = 0; countX < this.columns; countX++) {
            var tile = this.Tile.create();
            tile.x = countX;
            tile.y = countY;
            tile.z = this._total;
            this._matrix[countY].push(tile);
            this._total++;
        }
    }
  },

  /**
   * Retrieves a tile based on its x and y coordinates
   *
   * @method get
   * @param {Number} x
   * @param {Number} y
   * @returns {Tile}
   */
  get: function(x, y) {
    var t;
    if ((t = this._matrix[y])) {
      if ((t = t[x])) {
        return t;
      }
    }
    return t;
  },

  /**
   * Retrieves the adjacent tiles of a tile.
   *
   * @method adjacent
   * @param {Hiraya.Tile} tile
   * @returns {Array}
   */
  adjacent: function(tile) {
    var t, adjacent;
    adjacent = [];
    if ((t = this.get(tile.x - 1, tile.y - 1))) { /** NW **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x, tile.y - 1))) { /** N **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x + 1, tile.y - 1))) { /** NE **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x - 1, tile.y))) { /** E **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x + 1, tile.y))) { /** W **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x - 1, tile.y + 1))) { /** SW **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x, tile.y + 1))) { /** S **/
      adjacent.push(t);
    }
    if ((t = this.get(tile.x + 1, tile.y + 1))) { /** SE **/
      adjacent.push(t);
    }
    console.log('test', adjacent);
    return adjacent;
  }
});

module.exports = Tiles;
