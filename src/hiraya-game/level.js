/**
 * @module hiraya
 * @submodule hiraya-game
 */


var Emitter = require('../hiraya-core/emitter');
var Collection = require('../hiraya-core/collection');

/**
 * `Hiraya.Level` manages the game logic and entity interaction.
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
});

module.exports = Level;
