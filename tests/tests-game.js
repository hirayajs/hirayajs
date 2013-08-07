// Generated by CoffeeScript 1.3.3
(function() {
  var Hiraya, expect;

  if (typeof require === 'function') {
    Hiraya = require('../src/');
    expect = require('expect.js');
  } else {
    Hiraya = this.Hiraya;
    expect = this.expect;
  }

  describe('hiraya-game', function() {
    describe('Hiraya.Stat', function() {
      describe('#setValue(value)', function() {
        return it('should be able to set its value', function() {
          var stat;
          stat = Hiraya.Stat.create({
            name: 'health',
            value: 100,
            max: 100
          });
          return expect(stat.value).to.be(100);
        });
      });
      describe('#setMax(value)', function() {
        return it('should be able to set its max value', function() {
          var stat;
          stat = Hiraya.Stat.create({
            name: 'health',
            value: 100
          });
          return expect(stat.max).to.be(100);
        });
      });
      describe('#empty()', function() {
        return it('should be able to empty itself', function() {
          var stat;
          stat = Hiraya.Stat.create({
            name: 'health',
            value: 100
          });
          stat.empty();
          return expect(stat.value).to.be(0);
        });
      });
      describe('#reset()', function() {
        return it('should be able to reset itself', function() {
          var stat;
          stat = Hiraya.Stat.create({
            name: 'health',
            value: 0,
            max: 100
          });
          stat.reset();
          return expect(stat.value).to.be(100);
        });
      });
      return describe('#add(value)', function() {
        return it('should be able to increment its value', function() {
          var stat;
          stat = Hiraya.Stat.create({
            name: 'health',
            value: 1,
            max: 2
          });
          stat.add(1);
          return expect(stat.value).to.be(2);
        });
      });
    });
    describe('Hiraya.Entity', function() {
      var entity;
      entity = Hiraya.Entity.create();
      describe('#stats.health', function() {
        return it('should have a health attribute', function() {
          return expect(entity.stats.health).to.be.ok();
        });
      });
      describe('#stats.attack', function() {
        return it('should have an attack attribute', function() {
          return expect(entity.stats.attack).to.be.ok();
        });
      });
      describe('#damage(damage)', function() {
        return it('should be able to receive damage', function() {
          entity.stats.health.setValue(100);
          entity.damage(100);
          return expect(entity.stats.health.value).to.be(0);
        });
      });
      return describe('#attack(enemy)', function() {
        return it('should be able to inflict damage', function() {
          var enemy;
          enemy = Hiraya.Entity.create();
          enemy.stats.health.setValue(100);
          entity.stats.attack.setValue(10);
          return entity.attack(enemy);
        });
      });
    });
    describe('Hiraya.EntityTurnBased', function() {
      var entity;
      entity = Hiraya.EntityTurnBased.create();
      it('should have a turn attribute', function() {
        return expect(entity.stats.turn).to.be.ok();
      });
      return it('should have a turnspeed attribute', function() {
        return expect(entity.stats.turnspeed).to.be.ok();
      });
    });
    describe('Hiraya.Tile', function() {
      var entity, tile;
      tile = Hiraya.Tile.create({
        x: 0,
        y: 0
      });
      entity = Hiraya.Entity.create();
      describe('#occupy(entity)', function() {
        return it('should be able to contain entities', function() {
          tile.occupy(entity);
          return expect(tile.has(entity)).to.be.ok();
        });
      });
      describe('#vacate(entity)', function() {
        return it('should be able to remove entities from itself', function() {
          tile.vacate(entity);
          return expect(tile.has(entity)).to.not.be.ok();
        });
      });
      return describe('#isOccupied', function() {
        return it('should know if it has occupants in it', function() {
          tile.occupy(entity);
          return expect(tile.isOccupied()).to.be.ok();
        });
      });
    });
    describe('Hiraya.Tiles', function() {
      describe('#rows, #columns', function() {
        return it('should have a default rows and columns value', function() {
          var tiles;
          tiles = Hiraya.Tiles.create();
          expect(tiles.columns).to.be.ok();
          return expect(tiles.rows).to.be.ok();
        });
      });
      return describe('#get(x,y)', function() {
        return it('should be able to retrieve a tile by its x and y axis', function() {
          var tiles;
          tiles = Hiraya.Tiles.create({
            x: 1,
            y: 1
          });
          return expect(tiles.get(2, 1)).to.be.ok();
        });
      });
    });
    describe('Hiraya.Level', function() {
      var level;
      level = Hiraya.Level.create();
      describe('#entities', function() {
        return it('should be able to handle entities', function() {
          return expect(level.entities.length).to.be(0);
        });
      });
      return describe('#createEntity(attributes)', function() {
        return it('should create an entity based on attributes', function() {
          var attributes, entity;
          attributes = {
            stats: {
              health: [100, 100]
            }
          };
          entity = level.createEntity(attributes);
          return expect(entity.stats.health.value).to.be(attributes.stats.health[0]);
        });
      });
    });
    return describe('Hiraya.LevelTurnBased', function() {
      var level;
      level = Hiraya.LevelTurnBased.create();
      describe('#addEntity(entity)', function() {
        return it('should be able to add an entity with a default turn and turnspeed attribute', function() {
          level.addEntity(level.createEntity({
            id: 'entity-0'
          }));
          level.addEntity(level.createEntity({
            id: 'entity-1',
            stats: {
              turnspeed: [20]
            }
          }));
          expect(level.entities.at(0).stats.turn.value).to.be(0);
          return expect(level.entities.at(1).stats.turnspeed.value).to.be(20);
        });
      });
      describe('#getEntity(id)', function() {
        return it('should be able to retrieve an entity by ID', function() {
          return expect(level.getEntity('entity-0')).to.be.ok();
        });
      });
      describe('#getTurn(fn)', function() {
        return it('should be able to calculate turns and reset the turn stat of the active entity to 0', function(done) {
          level.gotTurn = function(entityTurnBased) {
            if (entityTurnBased) {
              if (entityTurnBased.stats.turn.isEmpty()) {
                return done();
              }
            }
          };
          level.addEntity(level.createEntity({
            id: 'entity-1',
            stats: {
              turn: [0, 100],
              turnspeed: [10]
            }
          }));
          level.addEntity(level.createEntity({
            id: 'entity-2',
            stats: {
              turn: [0, 100],
              turnspeed: [20]
            }
          }));
          return level.getTurn();
        });
      });
      return describe('#evaluateEntities()', function() {
        return it('should be able to announce a winner when only one entity is alive', function(done) {
          var firstEntity;
          firstEntity = level.entities.at(0);
          level.hasWinner = function(entity) {
            return done();
          };
          level.entities.each(function(entity) {
            if (firstEntity !== entity) {
              return entity.stats.health.empty();
            }
          });
          return level.evaluateEntities();
        });
      });
    });
  });

}).call(this);
