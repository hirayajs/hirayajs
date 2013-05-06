/**
 * @module hiraya
 * @submodule hiraya-game
 */



var Emitter = require('../hiraya-core/emitter');

/**
 * `Hiraya.Game` is the entry point of the framework. Instantiating this will serve as your namespace,
 * as well as reference to instantiated objects that the Hiraya framework provides.
 *
 * @class Game
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Game = Emitter.extend({
  /**
   * The `ready` event fires when the window is ready and all the assets are loaded
   *
   * @event ready
   */
  ready: function() {
  }
});

module.exports = Game;
