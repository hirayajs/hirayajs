if typeof require is 'function'
  Hiraya = require '../src/'
  expect = require 'expect.js'
else
  Hiraya = @Hiraya
  expect = @expect

describe 'Turn-based game test suite', ->
  describe 'A Game', ->
    Game = Hiraya.Game.create()
    it 'should create a Game namespace', ->
      expect(Game).to.be.ok()
    it 'should have a default Level class', ->
      expect(Game.Level).to.be.ok()
  describe 'Game: Adding entities', ->
    it 'should be able to add entities based on attributes', ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        ready: ->
          @addEntity
            name: 'Marine'
            stats:
              health: [400,1000]
          expect(@entities.at(0).stats.health.value).to.be(400)
          expect(@entities.at(0).stats.health.max).to.be(1000)
      Game.start()
    it 'should be able to automatically place entities in a tile by attributes', ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        Tiles: Hiraya.Tiles.extend
          rows: 10
          columns: 10
        ready: ->
          @addEntity
            name: 'Marine'
            tile:
              x: 9
              y: 9
          expect(@tiles.get(9,9).isOccupied()).to.be.ok()
      Game.start()
  describe 'Moving entities', ->
    it 'should be able to move entities to a different tile', ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        Tiles: Hiraya.Tiles.extend
          Tile: Hiraya.Tile.extend
            vacate: ->
              console.log 'leaving...'
              @parent()
          rows: 10
          columns: 10
        ready: ->
          @addEntity
            name: 'Marine'
            tile:
              x: 9
              y: 9
          expect(@tiles.get(9,9).isOccupied()).to.be.ok()
          @tiles.get(0,0).occupy(@entities.at(0))
          expect(@entities.at(0).get('tile')).to.be(@tiles.get(0,0))
      Game.start()
    it 'should be able to target other entities', ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        ready: ->
          @addEntity
            stats: health: [1], attack: [1]
            tile: x: 0, y: 1
          @addEntity
            stats: health: [1], attack: [1]
            tile: x: 0, y: 0
          hero = @entities.at 0
          enemy = @entities.at 1
          hero.attack enemy
          expect(enemy.stats.health.isEmpty()).to.be(true)
      Game.start()
