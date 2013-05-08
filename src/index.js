var Hiraya = {
  /** hiraya-core **/
  Class: require('./hiraya-core/class'),
  Emitter: require('./hiraya-core/emitter'),
  Collection: require('./hiraya-core/collection'),
  Stat: require('./hiraya-game/stat'),
  Stats: require('./hiraya-game/stats'),
  EntityTurnBased: require('./hiraya-game/entity-turnbased'),
  Entity: require('./hiraya-game/entity'),
  /** hiraya-game **/
  Game: require('./hiraya-game/game'),
  Level: require('./hiraya-game/level'),
  LevelTurnBased: require('./hiraya-game/level-turnbased')
  /** hiraya-game/display **/
};

if (typeof window === 'object') {
  window.Hiraya = Hiraya;
}

module.exports = Hiraya;
