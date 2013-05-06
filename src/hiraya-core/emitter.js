/**
 * @module hiraya
 * @submodule hiraya-core
 */


var Class = require('./class');
var EventEmitter = require('events').EventEmitter;

/**
 * `Hiraya.Emitter` handles event-based callbacks.
 * For example if you wish to create an event manager that dispatches data
 * everytime a certain topic is called:
 *
 *      Game.topicEmitter = Hiraya.Emitter.create({
 *        newTopic: function(topic) {
 *          this.emit('newTopic', topic);
 *        }
 *      });
 *
 *      Game.topicEmitter.on('newTopic', function(topic) {
 *        console.log('Got a new topic:', topic);
 *      });
 *
 *      Game.topicEmitter.newTopic('entityCreate');
 *
 * @class Emitter
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Emitter = Class.extend({
  init: function() {
  },
  /**
   * Adds a listener to the emitter object
   *
   * @method on
   * @param {String} topic 
   * @param {Function} callback 
   * @chainable
   */
  on: function() {
    EventEmitter.prototype.on.apply(this, arguments);
    return this;
  },

  /**
   * Removes a listener from the emitter object
   *
   * @method off
   * @param {String} topic
   * @param {Function} callback
   * @chainable
   */
  off: function(topic, callback) {
    EventEmitter.prototype.removeListener.apply(this, arguments);
    return this;
  },


  /**
   * Removes all listeners or the topic specified
   *
   * @method offAll
   * @param {String} [topic]
   * @chainable
   */
  offAll: function() {
    EventEmitter.prototype.removeAllListeners.apply(this, arguments);
    return this;
  },

  /**
   * Emits a topic contained in the emitter object
   *
   * @method emit
   * @param {String} topic
   * @param {Object|String} data*
   * @chainable
   */
  emit: function() {
    EventEmitter.prototype.emit.apply(this, arguments);
    return this;
  },

  /**
   * Subscribes to a topic only once
   *
   * @method once
   * @param {String} topic
   * @chainable
   */
  once: function() {
    EventEmitter.prototype.once.apply(this, arguments);
    return this;
  },


  /**
   * Remove an event listener
   *
   * @methoda removeListener
   * @param {String} topic
   * @param {Function} callback
   * @private
   * @chainable
   */
  removeListener: function() {
    EventEmitter.prototype.removeListener.apply(this, arguments);
    return this;
  }
});


module.exports = Emitter;
