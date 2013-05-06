var Hiraya = {
  /** hiraya-core **/
  Class: require('./hiraya-core/class'),
  Collection: require('./hiraya-core/collection'),
  Emitter: require('./hiraya-core/emitter'),
  /** hiraya-game **/
  Game: require('./hiraya-game/game'),
  Level: require('./hiraya-game/level')
  /** hiraya-game/display **/
};

window.Hiraya = Hiraya;
