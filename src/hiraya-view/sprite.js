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
   * A createjs.BitmapAnimation or createjs.Bitmap instance
   *
   * @property view
   * @type {createjs.BitmapAnimation} 
   */
  view: null,

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
