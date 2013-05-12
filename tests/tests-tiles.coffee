if typeof require is 'function'
  Hiraya = require '../src/'
  expect = require 'expect.js'
else
  Hiraya = @Hiraya
  expect = @expect

describe 'Hiraya.Tiles', ->
  tiles = Hiraya.Tiles.create rows: 5, columns: 5
  it 'should be able to identify adjacent tiles of a single tile', ->
    adjacent = tiles.adjacent tiles.get(0,0)
    expect(adjacent.length).to.be.ok()
