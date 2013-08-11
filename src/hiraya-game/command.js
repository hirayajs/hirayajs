/**
 * @module hiraya
 * @submodule hiraya-game
 */

var Class = require('../hiraya-core/class');

/**
 * A class for creating commands for entities. Use this to construct
 * skills, abilities, etc.
 *
 * @class Command
 * @extends Hiraya.Class
 * @namespace Hiraya
 */
var Command = Class.extend({
  /**
   * Name of the command
   *
   * @property name
   * @type {String}
   */
  name: null,

  /**
   * Base damage of this command
   *
   * @property damage
   * @type {Number}
   * @default 0
   */
  damage: 0

});

module.exports = Command;
