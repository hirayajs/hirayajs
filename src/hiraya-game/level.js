/**
 * @module hiraya
 * @submodule hiraya-game
 */


var GetterSetter = require('../hiraya-core/getter-setter');
var Collection = require('../hiraya-core/collection');
var Entity = require('./entity');
var Tiles = require('./tiles');

/**
 * `Hiraya.Level` manages the game logic and entity interaction.
 *
 * ### Events
 *
 * - `addedEntity`
 *
 * @class Level
 * @extends Hiraya.GetterSetter
 * @namespace Hiraya
 */
var Level = GetterSetter.extend({
  /**
   * @property entities
   * @type {Hiraya.Collection}
   */
  entities: null,

  Entity: Entity,

  Tiles: Tiles,

  init: function() {
    this.tiles = this.Tiles.create();
    this.entities = Collection.create();
    this.parent();
    this.ready();
  },

  /**
   * Emitted after initialization
   *
   * @event ready
   */
  ready: function() {
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
    var entity, stats, tile;
    entity = this.createEntity(attributes);
    stats = attributes.stats;
    if (typeof stats === 'object') {
      for (var key in stats) {
        if (stats.hasOwnProperty(key)) {
          var stat = stats[key];
          entity.stats.set(key, stat[0], stat[1]);
        }
      }
    }

    if (typeof attributes.tile === 'object') {
      tile = this.tiles.get(attributes.tile.x, attributes.tile.y);
      if (tile) {
        tile.occupy(entity);
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
    return this.Entity.create(attributes);
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
