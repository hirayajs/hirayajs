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
  Tile: require('./hiraya-game/tile'),
  Tiles: require('./hiraya-game/tiles'),
  TilesHex: require('./hiraya-game/tiles-hex'),
  Level: require('./hiraya-game/level'),
  LevelTurnBased: require('./hiraya-game/level-turnbased'),
  Command: require('./hiraya-game/command'),

  /** hiraya-view **/
  Canvas: require('./hiraya-view/canvas'),
  Sprite: require('./hiraya-view/sprite'),

  /** hiraya-util **/
  HexagonUtil: require('./hiraya-util/hexagon-util')

};

if (typeof window === 'object') {
  window.Hiraya = Hiraya;
}

module.exports = Hiraya;
