/**
 * @module hiraya
 * @submodule hiraya-game
 */


var GetterSetter = require('../hiraya-core/getter-setter');
var Stats = require('./stats');

/**
 * A basic game entity that has basic API like stats, attack and damage commands.
 *
 * @class Entity
 * @extends Hiraya.GetterSetter
 * @namespace Hiraya
 */
var Entity = GetterSetter.extend({
  /**
   * The id of the entity. Can be set uniquely or use the default Entity class ID
   *
   * @property id
   * @type {Number}
   */
  id: null,
  init: function() {
    if (this.id === undefined) {
      this.id = Entity.id++;
    }
    this.stats = Stats.create();
    this.stats
      .set('health', 100)
      .set('attack', 100);
    this.parent();
  },

  /**
   * Attacks an enemy based on its attack stat value
   *
   * @method attack
   * @param {Entity} enemy
   * @chainable
   */
  attack: function(enemy) {
    enemy.damage(this.stats.attack.value);
    return this;
  },

  /**
   * Reduces health by 1
   *
   * @method damage
   * @param {Number} damage
   * @chainable
   */
  damage: function(damage) {
    this.stats.health.reduce(damage);
    return this;
  },

  /**
   * Set the entity's attributes
   *
   * @method setStats
   * @param {Object} attributes
   */
  setStats: function(attributes) {
    for(var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = Stat.create({ max: attributes[key] });
      }
    }
  }
});

/**
 * An id counter for the Entity class
 *
 * @property id
 * @static
 * @type {Number}
 */
Entity.id = 0;

module.exports = Entity;
