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

  /**
   * The Entity class for this level
   * @property Entity
   * @type {Hiraya.Entity}
   */
  Entity: Entity,

  /**
   * Dictionary of all the entities in this level
   * @property _entityIDs
   * @type {Object}
   * @private
   */
  _entityIDs: {},

  /**
   * The Tiles class for this level
   * @property Tiles
   * @type {Hiraya.Tiles}
   */
  Tiles: Tiles,

  /**
   * Initialization
   * @method init
   */
  init: function() {
    this.tiles = this.Tiles.create();
    this.entities = Collection.create();
    this._super();
    this.ready();
  },

  /**
   * Emitted after initialization
   *
   * @event ready
   */
  ready: function() {
    this.emit('event', 'ready');
  },

  /**
   * Adds an entity into the collection.
   *
   * Following is an example format:
   *
   *     var entity = level.createEntity({
   *       name: 'Swordsman',
   *       stats: {
   *         health: [500, 1000] // value, max
   *         attack: [100] // value, max
   *       }
   *     });
   *     level.addEntity(entity);
   *
   * @method addEntity
   * @param {Hiraya.Entity} entity
   * @chainable
   */
  addEntity: function(entity) {
    // attributes.stats gets overwritten in library
    this.entities.add(entity);
    this.addedEntity(entity);
    this.emit('event', 'addedEntity', entity);
    if (entity.id) {
      this._entityIDs[entity.id] = entity;
    }
    return this;
  },

  /**
   * Removes an entity from the level.
   *
   * @method removeEntity
   * @param {Hiraya.Entity} entity
   * @chainable
   */
  removeEntity: function(entity) {
    if (entity) {
      this.entities.remove(entity);
      if (this._entityIDs[entity.id] === entity) {
        delete this._entityIDs[entity.id];
      }
    }
    return this;
  },

  /**
   * Retrieves an entity based on ID
   *
   * @method getEntity
   * @param {String} id
   */
  getEntity: function(id) {
    return this._entityIDs[id];
  },

  /**
   * Creates a `Hiraya.Entity` from a class. Use this to override the classname you wish to use.
   *
   * @method createEntity
   * @param {Object} attributes
   * @returns Hiraya.Entity
   */
  createEntity: function(attributes) {
    // create a clone of the attribute object
    var clone = JSON.parse(JSON.stringify(attributes));
    var stats = attributes.stats;
    var tile = attributes.tile;

    delete clone.stats;
    delete clone.tile;
    var entity = this.Entity.create(clone);

    // attribute parsing
    if (attributes) {
      // parse stats
      if (stats) {
        for (var key in stats) {
          if (stats.hasOwnProperty(key)) {
            var stat = stats[key];
            entity.stats.set(key, stat[0], stat[1]);
          }
        }
      }
      // parse tile position of the entity
      if (tile) {
        var entityTile = this.tiles.get(tile.x, tile.y);
        if (entityTile) {
          entityTile.occupy(entity);
        }
      }
    }

    return entity;
  },

  /**
   * Moves an entity to a tile in the level.
   *
   * @method moveEntity
   * @param {Hiraya.Entity} entity
   * @param {Object} position
   */
  moveEntity: function(entity, position) {
    var tile = this.tiles.get(position.x, position.y);
    if (!tile) return;
    // emit a movingEntity event hook
    this.movingEntity(entity, entity.tile, tile);
    // make sure to vacate the entity from the tile first
    var prevTile = entity.tile;
    if (prevTile) prevTile.vacate(entity);
    // occupy the tile
    tile.occupy(entity);
    this.movedEntity(entity, tile, prevTile);
  },

  /**
   * When an entity is added.
   *
   * @event addedEntity
   * @param {Hiraya.Entity} entity
   */
  addedEntity: function(entity) {
  },

  /**
   * When an entity has moved
   *
   * @event movedEntity
   * @param {Hiraya.Entity} entity The entity in question
   * @param {Hiraya.Tile} tile tile that the entity has moved
   * @param {Hiraya.Tile} prevTile previous tile before it was moved
   */
  movedEntity: function(entity, tile, prevTile) {
    this.emit('event', 'movedEntity', entity, tile, prevTile);
  },

  /**
   * When an entity is beginning to move
   *
   * @event movingEntity
   * @param {Hiraya.Entity} entity The entity in question
   * @param {Hiraya.Tile} startTile tile that the entity will start from
   * @param {Hiraya.Tile} endTile tile that the entity will go to
   */
  movingEntity: function(entity, startTile, endTile) {
    this.emit('event', 'movingEntity', entity, startTile, endTile);
  }


});

module.exports = Level;
