/**
 * @module hiraya
 * @submodule hiraya-view
 */

/**
 * Canvas manages the stage and all things happening in them.
 *
 * @class Sprite
 * @extends Hiraya.Emitter
 * @namespace Hiraya
 */
var Emitter = require('../hiraya-core/emitter');
var Sprite = Emitter.extend({

  /**
   * Sprite sheet frameData for the createjs.SpriteSheet class.
   *
   * @property sheetData
   * @type {Object}
   */
  sheetData: null,

  /**
   * Image resource to be used for the sprite object.
   *
   * @property image
   * @type {Image}
   */
  image: null,

  /**
   * The display object container for the sprite sheet animation and image.
   *
   * @property view
   * @type {createjs.BitmapAnimation} 
   */
  view: null,

  init: function() {
    this.view = new createjs.Container();
    if (this.name) {
      this.view.name = this.name;
    }

    if (typeof this.frameData === 'object') {
      var animation = new createjs.BitmapAnimation(new createjs.SpriteSheet(this.frameData));
      animation.name = 'animation';
      this.view.addChild(animation);
    }

    if (this.image instanceof Image) {
      var bitmap = new createjs.Bitmap(image);
      bitmap.name = 'image';
      this.view.addChild(bitmap);
    }

  },

  /**
   * Play the animation based on the key frame in the sprite's frame data.
   *
   * @method play
   * @param {String} frameLabel
   */
  play: function(frameLabel) {
    var animation = this.view.getChildByName('animation');
    if (animation) {
      animation.gotoAndPlay(frameLabel);
    }
  },

  /**
   * Set the x coordinate of this sprite
   *
   * @method x
   * @param {Number} x
   * @chainable
   */
  x: function(x) {
    this.view.x = x;
    return this;
  },

  /**
   * Set the y coordinate of this sprite
   *
   * @method y
   * @param {Number} y
   * @chainable
   */
  y: function(y) {
    this.view.y = y;
    return this;
  },

  /**
   * Sets the x and y coordinate of this sprite
   *
   * @method pos
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  pos: function(x, y) {
    this.x(x);
    this.y(y);
    return this;
  },

  /**
   * Seeks the frame animation label then stop.
   *
   * @method playStop
   * @param {String} frameLabel
   */
  playStop: function(frameLabel) {
    var animation = this.view.getChildByName('animation');
    if (animation) {
      animation.gotoAndStop(frameName);
    }
  },

  /**
   * Stop any animation.
   *
   * @method stop
   */
  stop: function() {
    var animation = this.view.getChildByName('animation');
    if (animation) {
      animation.stop();
    }
  },

  /**
   * An event hook that's fired when the sprite is added to the canvas.
   *
   * @event spawn
   *
   */
  spawn: function() {
  },

  /**
   * An event hook that's fired when the sprite starts moving.
   *
   * @event moveStart
   */
  moveStart: function() {
  },

  /**
   * An event hook that's fired when the sprite stops moving.
   *
   * @event moveEnd
   */
  moveEnd: function() {
  },

  /**
   * An event hook that's fired when the sprite starts attacking.
   * Optionally, the name of the attack can be passed here to
   * let the sprite know which animation to play.
   *
   * @event attackStart
   * @param {String} name
   * @optional
   */
  attackStart: function(name) {
  }
});


module.exports = Sprite;
