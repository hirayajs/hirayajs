if typeof require is 'function'
  Hiraya = require '../src/'
  expect = require 'expect.js'
else
  Hiraya = @Hiraya
  expect = @expect

describe 'Turn-based game test suite', ->
  describe 'A Base Game', ->
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
          @addEntity @createEntity
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
          @addEntity @createEntity
            name: 'Marine'
            tile:
              x: 9
              y: 9
          expect(@tiles.get(9,9).isOccupied()).to.be.ok()
      Game.start()
  describe 'Moving entities', ->
    it 'should be able to move entities to a different tile', (done) ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        Tiles: Hiraya.Tiles.extend
          rows: 10
          columns: 10
        ready: ->
          component =
            id: 'marine-test'
            name: 'Marine'
            tile:
              x: 9
              y: 9
          @addEntity @createEntity component
          entity = @getEntity component.id
          fromTile = @tiles.get entity.tile.x, entity.tile.y
          targetTileCoordinates = x: 3, y: 4
          @moveEntity entity, targetTileCoordinates
          movedTile = @tiles.get targetTileCoordinates.x, targetTileCoordinates.y
          if movedTile.isOccupied() and fromTile.isEmpty()
            do done
          else
            done 'error'
          #expect(false).to.be.ok()
      Game.start()
  describe 'Attacking entities', ->
    it 'should be able to target other entities', ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        ready: ->
          @addEntity @createEntity
            stats: health: [1], attack: [1]
            tile: x: 0, y: 1
          @addEntity @createEntity
            stats: health: [1], attack: [1]
            tile: x: 0, y: 0
          hero = @entities.at 0
          enemy = @entities.at 1
          hero.attack enemy
          expect(enemy.stats.health.isEmpty()).to.be(true)
      Game.start()
  describe 'Turn based entities', ->
    it 'should have a steps, range, turn and turnspeed stat attribute by DEFAULT', ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        ready: ->
          @addEntity @createEntity
            tile: x: 0, y: 0
          entity = @entities.at 0
          expect(entity.stats.steps).to.be.ok()
          expect(entity.stats.range).to.be.ok()
          expect(entity.stats.turn).to.be.ok()
          expect(entity.stats.turnspeed).to.be.ok()
      Game.start()
  describe 'A simple round', ->
    it 'should have two entities to start', (done) ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        minEntities: 2
        ready: ->
          @addEntity @createEntity
            stats: health: [1], attack: [1]
            tile: x: 0, y: 0
          @addEntity @createEntity
            stats: health: [1], attack: [1]
            tile: x: 1, y: 0
        addedEntity: ->
          if @entities.length >= @minEntities
            do @started
        started: ->
          done()
      Game.start()
    it 'should start calculating the turn list', (done) ->
      Game = Hiraya.Game.create()
      Game.Level = Hiraya.LevelTurnBased.extend
        minEntities: 2
        ready: ->
          @addEntity @createEntity
            stats: health: [1], attack: [1]
            tile: x: 0, y: 0
          @addEntity @createEntity
            stats: health: [1], attack: [1]
            tile: x: 1, y: 0
        addedEntity: ->
          if @entities.length >= @minEntities
            do @started
        started: ->
          do @getTurn
        gotTurn: ->
          done()
      Game.start()
describe.skip 'An automated game test', ->
  it 'should announce the winner once there is only one left', (done) ->
    Game = Hiraya.Game.create()
    Game.Level = Hiraya.LevelTurnBased.extend
      minEntities: 3
      _tickSpeed: 0,
      ready: ->
        @addEntity @createEntity
          id: 'marine'
          auto: true
          stats: health: [10], attack: [0], turnspeed: [0]
          tile: x: 0, y: 0
        @addEntity @createEntity
          id: 'marine-2'
          auto: true
          stats: health: [10], attack: [0], turnspeed: [0]
          tile: x: 1, y: 1
        @addEntity @createEntity
          id: 'vanguard'
          auto: true
          stats: health: [10], attack: [1], range: [1]
          tile: x: 5, y: 3
      addedEntity: (entity) ->
        if @entities.length is @minEntities
          do @started
      started: ->
        do @getTurn
      gotTurn: (entity) ->
        if (entity.auto)
          @autoTurn entity
      autoTurn: (entity) ->
        # only if no immediate target is located, move
        target = @proximity entity, 'range'
        target = target[0]
        if target
          @attackEntity entity, target
        else
          nearestEntityTileFrom = @nearestEntityTileFrom entity
          nearestEntityTileFrom.occupy entity
        do @evaluateEntities
        ##attackRange = @tiles.range entity.tile, entity.stats.range.value
        ##moveRange = @tiles.range entity.tile, entity.stats.steps.value
        #console.log @findNearestEnemy entity, @entities.list()
        # If there's a target length
        #if targets.length
        #  targets.forEach (target) ->
        #    entity.attack target
        #    console.log entity.name, 'attacked ', target.name, ': ->', target.stats.health.value
        #else
          #setTimeout =>
          #  do @evaluateEntities
          #, 100
      hasWinner: (entity) ->
        done()
      hasNoWinnerYet: ->
        do @getTurn
    Game.start()
