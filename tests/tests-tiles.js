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

  describe('Hiraya.Tiles', function() {
    var tiles;
    tiles = Hiraya.Tiles.create({
      rows: 10,
      columns: 10
    });
    tiles.get(5, 4).wall = true;
    describe('adjacent selection', function() {
      return it('should be able to identify adjacent tiles of a single tile', function() {
        var adjacent;
        adjacent = tiles.adjacent(tiles.get(5, 5));
        return expect(adjacent.length).to.be.ok();
      });
    });
    describe('range finding', function() {
      it('should be able to select a range of tiles from a single tile', function() {
        var range;
        range = tiles.range(tiles.get(3, 3), 1);
        return expect(range.length).to.be.ok();
      });
      return it('should NOT include walls in the selection', function() {
        var range, walls;
        range = tiles.range(tiles.get(5, 5));
        walls = range.filter(function(tile) {
          return tile.wall;
        });
        return expect(walls.length).to.be(0);
      });
    });
    return describe('path finding', function() {
      it('should be able to find an array of path between two tiles', function() {
        var path;
        path = tiles.path(tiles.get(0, 0), tiles.get(4, 1));
        return expect(path.length).to.be.ok();
      });
      it('should NOT include walls in the selection', function() {
        var path, walls;
        path = tiles.path(tiles.get(0, 0), tiles.get(5, 5));
        walls = path.filter(function(tile) {
          return tile.wall;
        });
        return expect(walls.length).to.be(0);
      });
      return it('should NOT include blocked tiles for consecutive tiles', function() {
        var blocked, path;
        tiles.get(0, 0).walls = [[1, 0]];
        path = tiles.path(tiles.get(0, 0), tiles.get(2, 0));
        blocked = path.filter(function(tile) {
          return tile === tiles.get(1, 0);
        });
        return expect(blocked.length).to.be(0);
      });
    });
  });

}).call(this);
