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
    return adjacent;
  },

  /**
   * Find the movement cost between two tiles. Internal use only.
   *
   * @method _movementCost
   * @param {Hiraya.Tile} start
   * @param {Hiraya.Tile} end
   * @private
   * @returns {Boolean}
   */
  _movementCost: function(start, end) {
    //return end.entities.length || end.wall ? 10000 : end.val();
    return end.wall ? 10000 : end.val();
  },

  /**
   * Retrives a list of tiles by radius
   *
   * @method range
   * @param {Hiraya.Tile} tile
   * @param {Number} [radius=1]
   * @param {Boolean} [ignoreCost=false]
   * @returns {Array}
   */
  range: function(tile, radius, ignoreCost) {
    var open = [tile];
    var closed = [];
    var currTile;
    var adjacent;
    var neighbor, newCost, i, _len, tileCost;

    if (radius === undefined) {
      radius = 1;
    }

    while(open.length > 0) {
      currTile = open.pop();
      closed.push(currTile);
      if (currTile.cost < radius) {
        adjacent = this.adjacent(currTile);
        _len = adjacent.length;
        for(i = 0; i < _len; i++) {
          neighbor = adjacent[i];
          tileCost = ignoreCost ? 1 : this._movementCost(currTile, neighbor);
          newCost = currTile.cost + tileCost;
          if (neighbor.blocked(currTile) || currTile.blocked(neighbor)) {
            continue;
          }
          if (neighbor.cost === -1 || newCost < neighbor.cost) {
            neighbor.cost = newCost;
            if (open.indexOf(neighbor) === -1) {
              open.push(neighbor);
            }
          }
        }
      }
    }

    var results = [];
    for(i=0,_len=closed.length; i < _len; i++) {
      currTile = closed[i];
      if (currTile.cost < radius) {
        if (results.indexOf(currTile) === -1) {
          results.push(currTile);
        }
      }
      currTile.cost = -1;
    }
    return results;
  },

  /**
   * Performs an A-star pathfinding algorithm
   *
   * @method path
   * @param {Hiraya.Tile} start
   * @param {Hiraya.Tile} end
   * @returns {Array}
   */
  path: function(start, end) {
    var openList,
    closedList,
    currentNode,
    neighbors,
    neighbor,
    scoreG,
    scoreGBest,
    i,
    _len;
    openList = [start];
    closedList = [];

    while(openList.length) {
      var lowestIndex = 0;
      for(i=0,_len = openList.length; i < _len; i++) {
        if (openList[i].f < openList[lowestIndex].f) {
          lowestIndex = i;
        }
      }
      currentNode = openList[lowestIndex];
      // case END: The result has been found.
      if (currentNode.x === end.x && currentNode.y === end.y) {
        var current = currentNode;
        var parent;
        var tiles = [];
        while (current.parent) {
          tiles.push(current);
          parent = current.parent; // capture the parent element.
          current.parent = null; // clear the tile's parent
          current = parent; // move to the next parent
        }
        return tiles.reverse();
      }
      // case DEFAULT: Move current node to the closed list.
      openList.splice(currentNode, 1);
      closedList.push(currentNode);
      // Find the best score in the neighboring tile of the hex.
      neighbors = this.adjacent(currentNode);
      for(i=0, _len = neighbors.length; i < _len; i++) {
        neighbor = neighbors[i];
        if (closedList.indexOf(neighbor) > -1 ||
            neighbor.wall ||
            //neighbor.isOccupied() ||
            currentNode.blocked(neighbor) ||
            neighbor.blocked(currentNode)
           ) {
              continue;
           }
           scoreG = currentNode.g + 1;
           scoreGBest = false;
           // if it's the first time to touch this tile.
           if(openList.indexOf(neighbor) === -1) {
             scoreGBest = true;
             neighbor.h = this.heuristic(neighbor, end);
             openList.push(neighbor);
           } else if (scoreG < neighbor.g) {
             scoreGBest = true;
           }
           if (scoreGBest) {
             neighbor.parent = currentNode;
             neighbor.g = scoreG;
             neighbor.f = neighbor.g + neighbor.h;
           }
      }
    }
    return [];
  },

  /**
   * Used to calculate the heuristics for the path-finding algorithm
   *
   * @method heuristic
   * @param {Hiraya.Tile} start
   * @param {Hiraya.Tile} destination
   * @param {Number} [cost=1]
   * @returns {Number}
   */
  heuristic: function(start, destination, cost) {
    var vectorX, vectorY;
    if (cost === null) {
      cost = 1;
    }
    vectorX = Math.pow(start.x - destination.x, 2);
    vectorY = Math.pow(start.y - destination.y, 2);
    return Math.sqrt(vectorX + vectorY);
  }
  
});

module.exports = Tiles;
