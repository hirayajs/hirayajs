var createjs = typeof window === 'object' ? window.createjs : {};
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
   * The createjs.Tween bridge
   *
   * @property Tween
   * @type {createjs.Tween}
   */
  Tween: createjs.Tween,

  /**
   * The createjs.Ease bridge
   *
   * @property Ease
   * @type {createjs.Ease}
   */
  Ease: createjs.Ease,

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

  /**
   * Walk speed animation of the sprite.
   *
   * @property walkSpeed
   * @type {Nimber}
   * @default 500
   */
  walkSpeed: 500,

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
   * Sets the x and y coordinate of this sprite.
   * You can optionally pass an object with the x and y values.
   *
   *    var sprite = Hiraya.Sprite.create();
   *    sprite.pos({ x: 100, y: 100 });
   *
   *    // using it in conjunction with the hexagon util class
   *    sprite.pos(Hiraya.HexagonUtil.coordinates({ x: 100, y: 200 }));
   *
   * @method pos
   * @param {Number} x
   * @param {Number} y
   * @chainable
   */
  pos: function(x, y) {
    if (typeof x === 'object') { // argument is being passed as an object coordinate
      this.x(x.x);
      this.y(x.y);
    } else {
      this.x(x);
      this.y(y);
    }
    return this;
  },

  /**
   * Flips the sprite to the left side
   *
   * @method faceLeft
   */
  faceLeft: function() {
    this.vector = -1;
    this.view.scaleX *= this.vector;
  },

  /**
   * Flips the sprite to the right side
   *
   * @method faceRight
   */
  faceRight: function() {
    this.vector = 1;
    this.view.scaleX *= this.vector;
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
   */
  attackStart: function(name) {
  },

  /**
   * An event hook that's fired when this sprite is being targetted.
   * The command of the action is passed to let the sprite know if it should
   * perform certain animations based on the command attributes.
   *
   * For example, if the sprite is receiving a command that involves stealth, it
   * can optionally not perform a defend stance animation.
   *
   * @event defendStart
   * @param {Hiraya.Sprite} sprite the sprite performing an action on this unit.
   * @param {Hiraya.Command} command the command
   */
  defendStart: function(sprite, command) {
  },

  /**
   * An event hook that's fired when the sprite is done defending itself. The command
   * used for the attack is passed to let the sprite know if it should perform certain
   * animations based on command attributes.
   *
   * For example, if the sprite gets a command with stun attribute, the sprite
   * can optionally perform a "freezing" animation.
   *
   * @event defendEnd
   * @param {Hiraya.Sprite} sprite the sprite performing an action on this unit.
   * @param {Hiraya.Command} command the command
   */
  defendEnd: function(sprite, command) {
  },

  /**
   * When the sprite is damaged or being hit.
   * @event hit
   */
  hit: function() {
  }
});


module.exports = Sprite;
