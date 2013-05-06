if typeof require is 'function'
  Hiraya = require '../src/'
  expect = require 'expect.js'
else
  Hiraya = @Hiraya
  expect = @expect

describe 'hiraya-core', ->

  describe 'Hiraya.Class', ->

    describe '#create()', ->
      ## --------------------------
      it 'should instantiate a new self', ->
        Hiraya.Class.create()

    describe '#extend()', ->
      ## --------------------------
      it 'should have super methods for method overrides', (done) ->
        ClassA = Hiraya.Class.extend
          init: ->
            done()
        ClassB = ClassA.extend
          init: ->
            do @parent
        ClassB.create()

  describe 'Hiraya.Emitter', ->
    describe '#on()', ->
      ## --------------------------
      it 'can listen to events', (done) ->
        emitter = Hiraya.Emitter.create()
        emitter.on 'event', ->
          done()
        emitter.emit 'event'

      ## --------------------------
      it 'can have multiple callbacks for a single topic', (done) ->
        emitter = Hiraya.Emitter.create()
        emitter.maxCount = 2
        emitter.count = 0
        check = ->
          emitter.count++
          do done if emitter.count is emitter.maxCount
        emitter.on 'event', ->
          check()
        emitter.on 'event', ->
          check()
        emitter.emit 'event'

    describe '#once()', ->
      ## --------------------------
      it 'can listen to a topic once', ->
        emitter = Hiraya.Emitter.create()
        emitter.count = 0
        emitter.once 'event', ->
          emitter.count++
        emitter.emit 'event'
        emitter.emit 'event'
        expect(emitter.count).to.be(1)

    describe '#off()', ->
      ## --------------------------
      it 'can unsubscribe from events', ->
        emitter = Hiraya.Emitter.create()
        emitter.on 'event', ->
        emitter.emit 'event'
      ## --------------------------

    describe '#offAll()', ->
      ## --------------------------
      it 'can unsubscribe from all events', ->
        emitter = Hiraya.Emitter.create()
        emitter.on 'event', ->
          expect().fail 'Unsubscribe fail from 1st topic'
        emitter.on 'event2', ->
          expect().fail 'Unsubscribe fail from 2nd topic'
        emitter.offAll()
        emitter.emit 'event'
        emitter.emit 'event2'
        expect(true).to.be.ok()
      ## --------------------------
      it 'can unsubscribe from certain topics', (done) ->
        emitter = Hiraya.Emitter.create()
        emitter.on 'event', ->
          done 'Unsubscribe fail from 1st topic'
        emitter.on 'event2', ->
          done()
          emitter.passed = true
        emitter.offAll 'event'
        emitter.emit 'event'
        emitter.emit 'event2'

    describe '#emit()', ->
      ## --------------------------
      it 'can receive multiple parameters from topics', (done) ->
        message = 'foo'
        message2 = 'foo2'
        emitter = Hiraya.Emitter.create()
        emitter.on 'event', (arg1, arg2) ->
          if arg1 is message and arg2 is message2
            done()
          else
            done "incorrect arguments"
        emitter.emit 'event', message, message2

  describe 'Hiraya.Collection', ->
    describe '#add()', ->
      it 'should add an item to the list', ->
        a = name: 'James'
        c = Hiraya.Collection.create()
        c.add a
        expect(c.length).to.be(1)

    describe '#at', ->
      it 'should return the correct object', ->
        a = Hiraya.Class.create name: 'James'
        b = Hiraya.Class.create name: 'Doris'
        c = Hiraya.Collection.create()
        c.add a
        c.add b
        expect(c.at(0)).to.be(a)

    describe '#remove', ->
      it 'should remove an item from the list', ->
        a = Hiraya.Class.create name: 'James'
        c = Hiraya.Collection.create()
        c.add a
        c.remove a
        expect(c.length).to.be(0)

    describe '#length', ->
      it 'should return the correct children', ->
        a = Hiraya.Class.create name: 'James'
        b = Hiraya.Class.create name: 'Doris'
        c = Hiraya.Collection.create()
        c.add a
        c.add b
        expect(c.length).to.be(2)
