if typeof require is 'function'
  Hiraya = require '../src/'
  expect = require 'expect.js'
else
  Hiraya = @Hiraya
  expect = @expect

describe 'hiraya-game', ->
  describe 'Hiraya.Stat', ->
    describe '#setValue(value)', ->
      it 'should be able to set its value', ->
        stat = Hiraya.Stat.create
          name: 'health'
          value: 100
          max: 100
        expect(stat.value).to.be(100)
    describe '#setMax(value)', ->
      it 'should be able to set its max value', ->
        stat = Hiraya.Stat.create
          name: 'health'
          value: 100
        expect(stat.max).to.be(100)
    describe '#empty()', ->
      it 'should be able to empty itself', ->
        stat = Hiraya.Stat.create
          name: 'health'
          value: 100
        do stat.empty
        expect(stat.value).to.be(0)
    describe '#reset()', ->
      it 'should be able to reset itself', ->
        stat = Hiraya.Stat.create
          name: 'health'
          value: 0
          max: 100
        do stat.reset
        expect(stat.value).to.be(100)
    describe '#add(value)', ->
      it 'should be able to increment its value', ->
        stat = Hiraya.Stat.create
          name: 'health'
          value: 1
          max: 2
        stat.add 1
        expect(stat.value).to.be(2)
  describe 'Hiraya.Entity', ->
    entity = Hiraya.Entity.create()
    describe '#stats.health', ->
      it 'should have a health attribute', ->
        expect(entity.stats.health).to.be.ok()
    describe '#stats.attack', ->
      it 'should have an attack attribute', ->
        expect(entity.stats.attack).to.be.ok()
    describe '#damage(damage)', ->
      it 'should be able to receive damage', ->
        entity.stats.health.setValue(100)
        entity.damage(100)
        expect(entity.stats.health.value).to.be(0)
    describe '#attack(enemy)', ->
      it 'should be able to inflict damage', ->
        enemy = Hiraya.Entity.create()
        enemy.stats.health.setValue(100)
        entity.stats.attack.setValue(10)
        entity.attack enemy
  describe 'Hiraya.EntityTurnBased', ->
    entity = Hiraya.EntityTurnBased.create()
    it 'should have a turn attribute', ->
      expect(entity.stats.turn).to.be.ok()
    it 'should have a turnspeed attribute', ->
      expect(entity.stats.turnspeed).to.be.ok()
  describe 'Hiraya.Tile', ->
    tile = Hiraya.Tile.create x: 0, y: 0
    entity = Hiraya.Entity.create()
    describe '#occupy(entity)', ->
      it 'should be able to contain entities', ->
        tile.occupy entity
        expect(tile.has(entity)).to.be.ok()
    describe '#vacate(entity)', ->
      it 'should be able to remove entities from itself', ->
        tile.vacate entity
        expect(tile.has(entity)).to.not.be.ok()
    describe '#isOccupied', ->
      it 'should know if it has occupants in it', ->
        tile.occupy entity
        expect(tile.isOccupied()).to.be.ok()
  describe 'Hiraya.Level', ->
    level = Hiraya.Level.create()
    describe '#entities', ->
      it 'should be able to handle entities', ->
        expect(level.entities.length).to.be(0)
    describe '#addEntity(attributes)', ->
      it 'should create an entity based on attributes', ->
        attributes = stats:
          health: [100,100]
        level.addEntity attributes
        expect(level.entities.at(0).stats.health.value).to.be(attributes.stats.health[0])
  describe 'Hiraya.LevelTurnBased', ->
    level = Hiraya.LevelTurnBased.create()
    describe '#addEntity(attributes)', ->
      it 'should be able to add an entity with a default turn and turnspeed attribute', ->
        level.addEntity
          name: 'entity-1'
        level.addEntity
          name: 'entity-2'
          stats:
            turnspeed: [20]
        expect(level.entities.at(0).stats.turn.value).to.be(100)
    describe '#getTurn(fn)', ->
      it 'should be able to calculate turns and reset the turn stat of the active entity to 0', (done) ->
        level.gotTurn = (entityTurnBased) ->
          if entityTurnBased
            if entityTurnBased.stats.turn.isEmpty()
              done()
        level.addEntity
          name: 'entity-1'
          stats:
            turn: [0,100]
            turnspeed: [10]
        level.addEntity
          name: 'entity-2'
          stats:
            turn: [0,100]
            turnspeed: [20]
        level.getTurn()
    describe '#evaluateEntities()', ->
      it 'should be able to announce a winner when only one entity is alive', (done) ->
        firstEntity = level.entities.at 0
        level.hasWinner = (entity) ->
          do done
        level.entities.each (entity) ->
          unless firstEntity is entity
            do entity.stats.health.empty
        do level.evaluateEntities
