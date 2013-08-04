/**
 * @module hiraya
 * @submodule hiraya-view
 */

var Emitter = require('../hiraya-core/emitter');
var $ = window.jQuery;
var createjs = window.createjs;


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
   * jQuery node equivalent of the canvas container
   *
   * @property $
   * @type {jQuery}
   */
  $: null,

  /**
   * The `createjs.Stage` instance.
   *
   * @property _stage
   * @type {createjs.Stage}
   * @private
   */
  _stage: null,


  /**
   * `Hiraya.Level` instance that is given by the Game object.
   *
   * @property level
   * @type {Hiraya.Level}
   */
  level: null,

  _paths: {},

  init: function() {
    this.parent();
    this.$ = $('#' + this.id);
    this._paths = {};
    var canvas = $('<canvas>').attr({ width: this.width, height: this.height });
    this.$.append(canvas);
    this._stage = new createjs.Stage(canvas.get(0));
    this.level.on('ready', this._levelEvents.bind(this));
  },

  _levelEvents: function() {
    console.log('yoo');
  },

  addLayer: function(name) {
    this._paths['layers:' + name] = new createjs.Container();
  },

  getLayer: function(name) {
    return this._paths['layers:' + name];
  }

});

module.exports = Canvas;
