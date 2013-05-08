var GetterSetter = require('../hiraya-core/getter-setter');
var Stats = require('./stats');

var Entity = GetterSetter.extend({
  init: function() {
    if (this.id === undefined) {
      this.id = Entity.id++;
    }
    this.stats = Stats.create();
    this.stats
      .set('health', 100)
      .set('attack', 100);
    this.parent();
  },
  attack: function(enemy) {
    enemy.damage(this.stats.attack.value);
    return this;
  },
  damage: function(damage) {
    this.stats.health.reduce(damage);
    return this;
  },
  setStats: function(attributes) {
    for(var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this[key] = Stat.create({ max: attributes[key] });
      }
    }
  }
});

Entity.id = 0;

module.exports = Entity;
