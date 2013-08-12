/**
 * @module hiraya
 * @submodule hiraya-view
 */

var Emitter = require('../hiraya-core/emitter');
var createjs = typeof window === 'object' ? window.createjs : {};

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
   * Frame rate setting for this canvas.
   *
   * @property fps
   * @type {Number}
   * @default 30
   */
  fps: 30,

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
   * A bridge between the canvas and `createjs.Tween`
   *
   * @property Tween
   * @type {createjs.Tween}
   */
  Tween: null,

  /**
   * A bridge between the canvas and `createjs.Ease`
   *
   * @property Ease
   * @type {createjs.Ease}
   */
  Ease: null,


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
    'ground',
    'tiles',
    'sprites',
    'foreground'
  ],

  /**
   * @property sprites
   * @type {Array}
   */
  sprites: [],

  init: function() {
    // add the canvas element to the DOM tree
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.id = this.id;
    document.body.appendChild(canvas);
    this._stage = new createjs.Stage(canvas);
    this._ticker = createjs.Ticker;
    this.Tween = createjs.Tween;
    this.Ease = createjs.Ease;

    var stage = this._stage;
    var ticker = this._ticker;

    // generate the layers
    if (this.layers && typeof this.layers.forEach === 'function') {
      this.layers.forEach(function(layerName, i) {
        var layer = new createjs.Container();
        layer.name = layerName;
        stage.addChild(layer);
      });
    }

    // setup event listeners
    ticker.addEventListener('tick', this.render.bind(this));
    stage.addEventListener('stagemousedown', this.mouseDown.bind(this));
    stage.addEventListener('stagemouseup', this.mouseUp.bind(this));
    stage.addEventListener('stagemousemove', this.mouseMove.bind(this));

    // set the frame rate
    ticker.setFPS(this.fps);
    this.ready();
  },

  /**
   * eauses the canvas rendering
   *
   * @method pause
   * @chainable
   */
  pause: function() {
    this._ticker.setPaused(true);
  },

  /**
   * Resumes the canvas rendering
   *
   * @method resume
   * @chainable
   */
  resume: function() {
    this._ticker.setPaused(false);
  },

  /**
   * @event mouseUp
   */
  mouseUp: function(event) {
  },

  /**
   * @event mouseDown
   */
  mouseDown: function(event) {
  },

  /**
   * @event mouseMove
   */
  mouseMove: function(event) {
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
  render: function(event) {
    if (event && event.paused) return;
    this._stage.update();
    this.update();
  },

  /**
   * Event hook for subscribing to a tick event.
   * @event update
   */
  update: function() {
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
   * Caches the graphical state of the layer to improve performance.
   * Note: You will need to uncache the layer to be able to see
   * the graphical updates of the children within it.
   *
   * @method cacheLayer
   * @param {String} layerName 
   * @param {Number} width
   * @param {Number} height
   * @chainable
   */
  cacheLayer: function(layerName, width, height) {
    var layer = this.getLayer(layerName);
    if (layer) {
      layer.cache(0, 0, width, height);
    }
    return this;
  },

  /**
   * Uncaches the graphical state of the layer made via the `cacheLayer` method.
   *
   * @method uncacheLayer 
   * @param {String} layerName 
   * @chainable
   */
  uncacheLayer: function(layerName) {
    var layer = this.getLayer(layerName);
    if (layer) {
      layer.uncache();
    }
    return this;
  },


  /**
   * An event hook when the level is object is ready.
   *
   * @param {Hiraya.Level} level
   * @event levelReady
   */
  levelReady: function(level) {
    level.on('event', this._levelEvent.bind(this));
    if (this.levelEvents.ready) {
      this.levelEvents.ready.call(this, level);
    }
  },

  /**
   * A dictionary of event hooks
   *
   * @property levelEvents
   * @type {Object}
   */
  levelEvents: {},

  /**
   * Callback for the level events
   *
   * @method _levelEvent
   * @param {String} type
   * @private
   */
  _levelEvent: function(type) {
    var event = this.levelEvents[type];
    if (event) {
      event.apply(this, Array.prototype.slice.call(arguments, 1)); // cut out the type argument
    }
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
  },

  /**
   * Current panned x value of the canvas
   *
   * @property _x
   * @type {Number}
   * @default 0
   * @private
   */
  _x: 0,

  /**
   * Current panned y value of the canvas
   *
   * @property _y
   * @type {Number}
   * @default 0
   * @private
   */
  _y: 0,

  /**
   * Pans the entire layer tree.
   *
   * @method pan
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  pan: function(x, y) {
    var layers = this.layers;
    this._x = x;
    this._y = y;
    for(var i=0; i<layers.length; i++) {
      var layer = this.getLayer(layers[i]);
      if (layer) {
        if (typeof x === 'number') layer.x = x;
        if (typeof y === 'number') layer.y = y;
      }
    }
  },

  /**
   * Pans the x axis of the layers in the canvas.
   *
   * @method panX
   * @param {Number} x
   * @chainable
   */
  panX: function(x) {
    var layers = this.layers;
    this._x = x;
    for(var i=0; i<layers.length; i++) {
      var layer = this.getLayer(layers[i]);
      if (layer) {
        layer.x = x;
      }
    }
  },

  /**
   * Pans the y axis of the layers in the canvas
   *
   * @method panY
   * @param {Number} y
   * @chainable
   */
  panY: function(y) {
    var layers = this.layers;
    this._y = y;
    for(var i=0; i<layers.length; i++) {
      var layer = this.getLayer(layers[i]);
      if (layer) {
        layer.y = y;
      }
    }
  },

  /**
   * Returns the current x value of the canvas pan
   *
   * @method x
   * @returns {Number}
   */
  x: function() {
    return this._x;
  },

  /**
   * Returns the current y value of the canvas pan
   *
   * @method y
   * @returns {Number}
   */
  y: function() {
    return this._y;
  },


  /**
   * Centers the board
   *
   * @method centerBoard
   */
  centerBoard: function() {
    var columns = this.level.tiles.columns;
    var rows = this.level.tiles.rows;
    var dimensions = Hiraya.HexagonUtil.dimensions(columns, rows);
    this.pan(this.width * 0.5 - dimensions.width * 0.5, this.height * 0.5 - dimensions.height * 0.5 + 50);
  },

  /**
   * Sorts the depth for the sprite with its associated tile as the argument.
   *
   * @method sortSpriteDepth
   * @param {Hiraya.Sprite} sprite
   * @param {Hiraya.Tile} tile
   */
  sortSpriteDepth: function(sprite, tile) {
    var layer = this.getLayer('sprites');
    if (!layer) return;
    if (!sprite) return;
    if (!tile || isNaN(tile.z)) return;
    layer.removeChild(sprite.view);
    sprite.view.z = tile.z;
    var length = layer.getNumChildren();
    for(var i=0; i<length; i++) {
      var child = layer.getChildAt(i);
      if (child.z >= sprite.view.z) {
        break;
      }
    }
    layer.addChildAt(sprite.view, i);
  }
});

module.exports = Canvas;
