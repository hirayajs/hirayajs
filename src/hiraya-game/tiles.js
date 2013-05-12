/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Class = require('../hiraya-core/class');
var Tile = require('./tile');

var Tiles = Class.extend({
  columns: 8,
  rows: 8,
  _matrix: null,
  _total: null,
  Tile: Tile,
  init: function() {
    this._generate();
  },
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

  get: function(x, y) {
    return this._matrix[y][x];
  }
});

module.exports = Tiles;
