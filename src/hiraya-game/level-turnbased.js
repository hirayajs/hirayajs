/**
 * @module hiraya
 * @submodule hiraya-game
 */


var Level = require('./level');
var EntityTurnBased = require('./entity-turnbased');

/**
 * `Hiraya.LevelTurnBased` manages entities and game logic for turn-based games.
 *
 * ### Events
 *
 * - `getTurnTimedOut`
 * - `gotTurn`
 * - `hasNoWinnerYet`
 * - `hasWinner`
 *
 * @class LevelTurnBased
 * @extends Hiraya.Level
 * @namespace Hiraya
 */
var LevelTurnBased = Level.extend({
  Entity: EntityTurnBased,

  /**
   * Determines how fast the tick for the turn calculation will be.
   *
   * @property tickSpeed
   * @type {Number}
   * @default 1
   */
  tickSpeed: 1,

  /**
   * Determines the number of tries the `.getTurn()` function can do before
   * giving up.
   *
   * @property _maxGetTurnAttempts
   * @type {Number}
   * @private
   * @default 25
   */
  _maxGetTurnAttempts: 25,

  /**
   * Finds the next entity to take its turn.
   *
   * @method getTurn
   */
  getTurn: function() {
    var entity, _this = this;
    var tries = 0;
    var maxTries = this._maxGetTurnAttempts;
    var tick = function() {
      entity = _this._getEntityTurn();
      tries++;
      if (!entity) {
        if (tries < maxTries) {
          setTimeout(tick, _this.tickSpeed);
        } else {
          _this.getTurnTimedOut();
        }
      } else {
        entity.stats.turn.empty();
        _this.gotTurn(entity);
      }
    };
    tick();
  },

  /**
   * Increases the entities' turn stat by 1 and returns an entity if it has reached its max turn stat value
   *
   * @method _getEntityTurn
   * @private
   * @returns Hiraya.EntityTurnBased
   */
  _getEntityTurn: function() {
    var total = this.entities.length;
    var entity;
    var result;
    for(var i=0; i<total; i++) {
      entity = this.entities.at(i);
      entity.stats.turn.add(entity.stats.turnspeed.value);
      if (entity.stats.turn.isMax()) {
        result = entity;
        break;
      }
    }
    return result;
  },

  /**
   * Checks to see if there is already a winning entity in the game.
   *
   * @method evaluateEntities
   * @returns null
   */
  evaluateEntities: function() {
    var enabled = [];
    var disabled = [];
    this.entities.each(function(entity) {
      if (entity.stats.health.isEmpty()) {
        disabled.push(entity);
      } else {
        enabled.push(entity);
      }
    });
    if (enabled.length <= 1) {
      this.hasWinner(enabled[0]);
    } else {
      this.hasNoWinnerYet();
    }
  },

  /**
   * Finds the nearest entities based on closed proximity.
   *
   * @method promixity
   * @param {Hiraya.EntityTurnBased} entity
   * @param {String} [by=null]
   * @returns {Array}
   */
  proximity: function(entity, by) {
    var distances = [],
      entities = [],
      tiles,
      radius = Math.floor(this.tiles.columns * 0.5)
    ;
    if (by === 'range') {
      radius = entity.stats.range.value;
    }
    tiles = this.tiles.range(entity.tile, radius, true);
    for(var i=0,len=tiles.length; i<len; i++) {
      var tile = tiles[i];
      var occupant = tile.entities[0];
      if (occupant && occupant !== entity) {
        var distance = Math.abs(occupant.tile.x - entity.tile.x + occupant.tile.y - entity.tile.y);
        var index = 0;
        for(var ii=0, llen=distances.length; ii<llen; ii++) {
          if (distance < distances[ii]) {
            index = ii;
            break;
          }
        }
        distances.splice(index, 0, distance);
        entities.splice(index, 0, occupant);
      }
    }
    return entities;
  },

  /**
   * Fired when an entity reaches its max `.stats.turnspeed` value.
   *
   * @event gotTurn
   * @param {Hiraya.EntityTurnBased} entity
   */
  gotTurn: function(entity) {
  },

  /**
   * Fired when a winner has been announced after performing a `.evaluateEntities()` function.
   *
   * @event hasWinner
   * @param {Hiraya.EntityTurnBased} entity
   */
  hasWinner: function(entity) {
  },

  /**
   * Fired when there is no winner yet after performing a `.evaluateEntities()` function.
   *
   * @event hasNoWinnerYet
   */
  hasNoWinnerYet: function() {
  },

  /**
   * Fired when attempts in finding an entity to take its turn has reached its maximum number of tries.
   *
   * @event getTurnTimedOut
   */
  getTurnTimedOut: function() {
  }
});


module.exports = LevelTurnBased;
