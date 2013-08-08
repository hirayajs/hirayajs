/**
 * @module hiraya
 * @submodule hiraya-view
 */

var Emitter = require('../hiraya-core/emitter');
var createjs = typeof window === 'object' ? window.createjs : null;

/**
 * Canvas manages the stage and all things happening in them.
 *
 * @class Canvas
 * @extends Hiraya.Emitter
 * @namespace Hiraya
 */
var Canvas = Emitter.extend({
  /**
   * The ID selector of the canvas container element.
   *
   * @property id
   * @type {String}
   * @default hg-canvas
   */
  id: 'hg-canvas',

  /**
   * Width of the canvas
   *
   * @property width
   * @type {Number}
   * @default 900
   */
  width: 900,

  /**
   * Height of the canvas
   *
   * @property height
   * @type {Number}
   * @default 500
   */
  height: 500,

  /**
   * The `createjs.Stage` instance.
   *
   * @property _stage
   * @type {createjs.Stage}
   * @private
   */
  _stage: null,


  /**
   * The createjs.Ticker static class
   *
   * @property _ticker
   * @type {createjs.Ticker}
   * @private
   */
  _ticker: null,

  /**
   * `Hiraya.Level` instance that is given by the Game object.
   *
   * @property level
   * @type {Hiraya.Level}
   */
  level: null,

  /**
   * The layer structure of the canvas. Useful for separating tiles, sprites, foreground
   * and background to name a few. Layer names listed in order will be generated accordingly.
   *
   *     Hiraya.Canvas.extend({
   *      layers: [
   *        'background',
   *        'tiles',
   *        'sprites',
   *        'foreground'
   *      ];
   *     })
   *
   *
   * @property layers
   * @type {Array}
   */
  layers: [
    'background',
    'tiles',
    'sprites',
    'foreground'
  ],

  /**
   * 
   *
   * @property sprites
   * @type {Array}
   */
  sprites: [],

  init: function() {
    this.parent();
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.id = this.id;
    document.body.appendChild(canvas);
    this._stage = new createjs.Stage(canvas);
    this._ticker = createjs.Ticker;

    var stage = this._stage;
    var ticker = this._ticker;

    if (this.layers && typeof this.layers.forEach === 'function') {
      this.layers.forEach(function(layerName, i) {
        var layer = new createjs.Container();
        layer.name = layerName;
        stage.addChild(layer);
      });
    }

    ticker.addEventListener('tick', this.render.bind(this));
    this.ready();
  },

  /**
   * When the canvas is ready for action.
   * @event ready
   */
  ready: function() {
  },

  /**
   * Renders the canvas operation.
   *
   * @method render
   * @private
   */
  render: function() {
    this._stage.update();
  },

  /**
   * Pause the render operation.
   * @method pause 
   * @param {Boolean} shouldPause if set to false, will reverse the pause command.
   */
  pause: function(shouldPause) {
    this._ticker.setPaused(shouldPause);
  },

  /**
   * @method addSprite
   * @param {Hiraya.Sprite} sprite
   * @chainable
   */
  addSprite: function(sprite) {
    var layer = this.getLayer('sprites');
    layer.addChild(sprite.view);
    sprite.spawn();
    return this;
  },

  /**
   * Adds a createjs.BitmapAnimation object to a layer.
   *
   * @param {String} layerName
   * @param {createjs.BitmapAnimation} animation
   * @chainable
   */
  addToLayer: function(layerName, animation) {
    var layer = this.getLayer(layerName);
    if (layer) {
      layer.addChild(animation);
    }
    return this;
  },

  /**
   * An event hook when the level is object is ready.
   *
   * @param {Hiraya.Level} level
   * @event level
   */
  levelReady: function(level) {
  },

  /**
   * Gets the layer from the stage.
   *
   * @param {String} layername
   * @return createjs.Container
   */
  getLayer: function(layerName) {
    return this._stage.getChildByName(layerName);
  },

  /**
   * Creates a static image derived from a sprite sheet.
   *
   * @method createStaticBitmapAnimation
   * @param {Object} frameData
   * @param {String} targetFrameLabel
   * @return createjs.BitmapAnimation
   */
  createStaticBitmapAnimation: function(frameData, targetFrameLabel) {
    var spriteSheet = new createjs.SpriteSheet(frameData);
    var animation = new createjs.BitmapAnimation(spriteSheet);
    animation.gotoAndStop(targetFrameLabel);
    return animation;
  }
});

module.exports = Canvas;
