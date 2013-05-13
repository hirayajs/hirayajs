if typeof require is 'function'
  Hiraya = require '../src/'
  expect = require 'expect.js'
else
  Hiraya = @Hiraya
  expect = @expect

describe 'Hiraya.Tiles', ->
  tiles = Hiraya.Tiles.create rows: 10, columns: 10
  tiles.get(5,4).wall = true
  describe 'adjacent selection', ->
    it 'should be able to identify adjacent tiles of a single tile', ->
      adjacent = tiles.adjacent tiles.get(5,5)
      expect(adjacent.length).to.be.ok()
  describe 'range finding', ->
    it 'should be able to select a range of tiles from a single tile', ->
      range = tiles.range tiles.get(3,3), 1
      expect(range.length).to.be.ok()
    it 'should NOT include walls in the selection', ->
      range = tiles.range tiles.get(5,5)
      walls = range.filter (tile) -> tile.wall
      expect(walls.length).to.be(0)
  describe 'path finding', ->
    it 'should be able to find an array of path between two tiles', ->
      path = tiles.path tiles.get(0,0), tiles.get(4,1)
      expect(path.length).to.be.ok()
    it 'should NOT include walls in the selection', ->
      path = tiles.path tiles.get(0,0), tiles.get(5,5)
      walls = path.filter (tile) -> tile.wall
      expect(walls.length).to.be(0)
    it 'should NOT include blocked tiles for consecutive tiles', ->
      tiles.get(0,0).walls = [
        [1,0]
      ]
      path = tiles.path tiles.get(0,0), tiles.get(2,0)
      blocked = path.filter (tile) -> tile is tiles.get(1,0)
      expect(blocked.length).to.be(0)
