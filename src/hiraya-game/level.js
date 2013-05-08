/**
 * @module hiraya
 * @submodule hiraya-game
 */


var Emitter = require('../hiraya-core/emitter');
var Collection = require('../hiraya-core/collection');
var Entity = require('./entity');

/**
 * `Hiraya.Level` manages the game logic and entity interaction.
 *
 * ### Events
 *
 * - `addedEntity`
 *
 * @class Level
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Level = Emitter.extend({
  /**
   * @property entities
   * @type {Array}
   */
  entities: null,

  init: function() {
    this.entities = Collection.create();
    this.parent();
  },

  /**
   * Adds an entity into the collection based on attributes.
   *
   * Following is an example format:
   *
   *     level.addEntity({
   *       name: 'Swordsman',
   *       stats: {
   *         health: [500, 1000] // value, max
   *         attack: [100] // value, max
   *       }
   *     })
   *
   * @method addEntity
   * @param {Object} attributes
   * @chainable
   */
  addEntity: function(attributes) {
    // attributes.stats gets overwritten in library
    var entity = this.createEntity(attributes);
    var stats = attributes.stats;
    for (var key in stats) {
      if (stats.hasOwnProperty(key)) {
        var stat = stats[key];
        entity.stats.set(key, stat[0], stat[1]);
      }
    }
    this.entities.add(entity);
    this.addedEntity(entity);
    return this;
  },

  /**
   * Creates a `Hiraya.Entity` from a class. Use this to override the classname you wish to use.
   *
   * @method createEntity
   * @param {Object} attributes
   * @returns Hiraya.Entity
   */
  createEntity: function(attributes) {
    return Entity.create(attributes);
  },

  /**
   * When an entity is added.
   *
   * @event addedEntity
   * @param {Entity} entity
   */
  addedEntity: function(entity) {
  }

});

module.exports = Level;
