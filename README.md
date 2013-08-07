# Hiraya.js

Hiraya.js is a JavaScript Game framework that's meant for building tactical [turn-based games](http://en.wikipedia.org/wiki/Turn-based_tactics). It is currently under development.

## Sample Code

```javascript
Game = Hiraya.Game.create();
Game.Level = Hiraya.LevelTurnBased.extend({
  minEntities: 3,
  _tickSpeed: 0,
  ready: function() {
    this.addEntity(this.createEntity({
      id: 'marine',
      auto: true,
      stats: {
        health: [10],
        attack: [0],
        turnspeed: [0]
      },
      tile: {
        x: 0,
        y: 0
      }
    }));
    this.addEntity(this.createEntity({
      id: 'marine-2',
      auto: true,
      stats: {
        health: [10],
        attack: [0],
        turnspeed: [0]
      },
      tile: {
        x: 1,
        y: 1
      }
    }));
    return this.addEntity(this.createEntity({
      id: 'vanguard',
      auto: true,
      stats: {
        health: [10],
        attack: [1],
        range: [1]
      },
      tile: {
        x: 5,
        y: 3
      }
    }));
  },
  addedEntity: function(entity) {
    if (this.entities.length === this.minEntities) {
      return this.started();
    }
  },
  started: function() {
    return this.getTurn();
  },
  gotTurn: function(entity) {
    if (entity.auto) {
      return this.autoTurn(entity);
    }
  },
  autoTurn: function(entity) {
    var nearestEntityTileFrom, target;
    target = this.proximity(entity, 'range');
    target = target[0];
    if (target) {
      entity.attack(target);
    } else {
      nearestEntityTileFrom = this.nearestEntityTileFrom(entity);
      nearestEntityTileFrom.occupy(entity);
    }
    return this.evaluateEntities();
  },
  hasWinner: function(entity) {
    return done();
  },
  hasNoWinnerYet: function() {
    return this.getTurn();
  }
});
Game.start();
```

## Development

- run `grunt server` to start serving the hiraya.js file in `http://localhost:8081/hiraya.js`.
- run `grunt develop` to start a watch task that does jshinting, browserification, uglification, and yuidoc generation.
