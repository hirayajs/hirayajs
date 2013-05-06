var Hiraya = {
  /** hiraya-core **/
  Class: require('./hiraya-core/class'),
  Emitter: require('./hiraya-core/emitter'),
  Collection: require('./hiraya-core/collection'),
  /** hiraya-game **/
  Game: require('./hiraya-game/game'),
  Level: require('./hiraya-game/level')
  /** hiraya-game/display **/
};

if (typeof window === 'object') {
  window.Hiraya = Hiraya;
}

module.exports = Hiraya;
