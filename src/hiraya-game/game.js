/**
 * @module hiraya
 * @submodule hiraya-game
 */



var Emitter = require('../hiraya-core/emitter');
var Level = require('../hiraya-game/level');
var Tiles = require('../hiraya-game/tiles');

/**
 * `Hiraya.Game` is the entry point of the framework. Instantiating this will serve as your namespace,
 * as well as reference to instantiated objects that the Hiraya framework provides.
 *
 *     Game = Hiraya.Game.create();
 *     Game.start(); // Game does its work like preloading assets, initializing classes, etc.
 *
 * @class Game
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Game = Emitter.extend({
  /**
   * Path dictionary
   *
   * @property paths
   * @type {Object}
   * @private
   */
  _paths: {},

  /**
   * The base level class of the game
   *
   * @property Level
   * @type {Level}
   * @default Hiraya.Level
   * @return this
   */
  Level: Level,

  start: function() {
    var _this = this;
    this._paths = {};
    this._paths.level = this.Level.create();
    if (this.Canvas && typeof this.Canvas.create === 'function') {
      this._paths.canvas = this.Canvas.create();
    }
    this.paths('canvas').levelReady(this._paths.level);
    this.paths('level').canvasReady(this._paths.canvas);
    this.ready();
    return this;
  },
  paths: function(path) {
    return this._paths[path];
  },
  /**
   * The `ready` event fires when the window is ready and all the assets are loaded
   *
   * @event ready
   */
  ready: function() {
  }
});

module.exports = Game;
