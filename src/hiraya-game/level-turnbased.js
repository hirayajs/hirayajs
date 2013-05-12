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
 * - `gotTurn`
 * - `addedEntity`
 * - `hasWinner`
 *
 * @class LevelTurnBased
 * @extends Hiraya.Level
 * @namespace Hiraya
 */
var LevelTurnBased = Level.extend({
  Entity: EntityTurnBased,

  /**
   * Determines how fast the tick for the turn calculation will be. Internal use only.
   *
   * @property _tickSpeed
   * @type {Number}
   * @private
   * @default 1
   */
  _tickSpeed: 1,

  /**
   * A timeout identifier for the tick operation.
   *
   * @property _turnTimeout
   * @private
   * @type {Number}
   */
  _turnTimeout: null,

  /**
   * Finds the next entity to take its turn.
   *
   * @method getTurn
   */
  getTurn: function() {
    var entity, _this = this;
    var tick = function() {
      entity = _this._getEntityTurn();
      if (!entity) {
        setTimeout(function() {
          tick();
        }, _this._tickSpeed);
      } else {
        entity.stats.turn.empty();
        _this.gotTurn(entity);
      }
    };
    tick();
  },

  /**
   * Invoked when an entity is taking its turn
   *
   * @event gotTurn
   * @param {Hiraya.EntityTurnBased} entityTurnBased
   */
  gotTurn: function(entityTurnBased) {
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
      entity.stats.turn.add(entity.stats.get('turnspeed').value);
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
    }
  },

  /**
   * Fires when a winner has been announced
   *
   * @event hasWinner
   * @param {entity} Hiraya.EntityTurnBased
   * @returns null
   */
  hasWinner: function(entity) {
  }
});


module.exports = LevelTurnBased;
