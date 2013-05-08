var Entity = require('./entity');

var EntityTurnBased = Entity.extend({
  init: function() {
    this.parent();
    this.stats.set('turn', 0, 100);
    this.stats.set('turnspeed', 10);
  }
});

module.exports = EntityTurnBased;
