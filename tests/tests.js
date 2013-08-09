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

  describe('hiraya-core', function() {
    describe('Hiraya.Class', function() {
      describe('#create()', function() {
        return it('should instantiate a new self', function() {
          return Hiraya.Class.create();
        });
      });
      return describe('#extend()', function() {
        return it('should have super methods for method overrides', function(done) {
          var ClassA, ClassB;
          ClassA = Hiraya.Class.extend({
            init: function() {
              return done();
            }
          });
          ClassB = ClassA.extend({
            init: function() {
              return this._super();
            }
          });
          return ClassB.create();
        });
      });
    });
    describe('Hiraya.Emitter', function() {
      describe('#on()', function() {
        it('can listen to events', function(done) {
          var emitter;
          emitter = Hiraya.Emitter.create();
          emitter.on('event', function() {
            return done();
          });
          return emitter.emit('event');
        });
        return it('can have multiple callbacks for a single topic', function(done) {
          var check, emitter;
          emitter = Hiraya.Emitter.create();
          emitter.maxCount = 2;
          emitter.count = 0;
          check = function() {
            emitter.count++;
            if (emitter.count === emitter.maxCount) {
              return done();
            }
          };
          emitter.on('event', function() {
            return check();
          });
          emitter.on('event', function() {
            return check();
          });
          return emitter.emit('event');
        });
      });
      describe('#once()', function() {
        return it('can listen to a topic once', function() {
          var emitter;
          emitter = Hiraya.Emitter.create();
          emitter.count = 0;
          emitter.once('event', function() {
            return emitter.count++;
          });
          emitter.emit('event');
          emitter.emit('event');
          return expect(emitter.count).to.be(1);
        });
      });
      describe('#off()', function() {
        return it('can unsubscribe from events', function() {
          var emitter;
          emitter = Hiraya.Emitter.create();
          emitter.on('event', function() {});
          return emitter.emit('event');
        });
      });
      describe('#offAll()', function() {
        it('can unsubscribe from all events', function() {
          var emitter;
          emitter = Hiraya.Emitter.create();
          emitter.on('event', function() {
            return expect().fail('Unsubscribe fail from 1st topic');
          });
          emitter.on('event2', function() {
            return expect().fail('Unsubscribe fail from 2nd topic');
          });
          emitter.offAll();
          emitter.emit('event');
          emitter.emit('event2');
          return expect(true).to.be.ok();
        });
        return it('can unsubscribe from certain topics', function(done) {
          var emitter;
          emitter = Hiraya.Emitter.create();
          emitter.on('event', function() {
            return done('Unsubscribe fail from 1st topic');
          });
          emitter.on('event2', function() {
            done();
            return emitter.passed = true;
          });
          emitter.offAll('event');
          emitter.emit('event');
          return emitter.emit('event2');
        });
      });
      return describe('#emit()', function() {
        return it('can receive multiple parameters from topics', function(done) {
          var emitter, message, message2;
          message = 'foo';
          message2 = 'foo2';
          emitter = Hiraya.Emitter.create();
          emitter.on('event', function(arg1, arg2) {
            if (arg1 === message && arg2 === message2) {
              return done();
            } else {
              return done("incorrect arguments");
            }
          });
          return emitter.emit('event', message, message2);
        });
      });
    });
    return describe('Hiraya.Collection', function() {
      describe('#add()', function() {
        return it('should add an item to the list', function() {
          var a, c;
          a = {
            name: 'James'
          };
          c = Hiraya.Collection.create();
          c.add(a);
          return expect(c.length).to.be(1);
        });
      });
      describe('#at()', function() {
        return it('should return the correct object', function() {
          var a, b, c;
          a = Hiraya.Class.create({
            name: 'James'
          });
          b = Hiraya.Class.create({
            name: 'Doris'
          });
          c = Hiraya.Collection.create();
          c.add(a);
          c.add(b);
          return expect(c.at(0)).to.be(a);
        });
      });
      describe('#remove()', function() {
        return it('should remove an item from the list', function() {
          var a, c;
          a = Hiraya.Class.create({
            name: 'James'
          });
          c = Hiraya.Collection.create();
          c.add(a);
          c.remove(a);
          return expect(c.length).to.be(0);
        });
      });
      return describe('#length', function() {
        return it('should return the correct children', function() {
          var a, b, c;
          a = Hiraya.Class.create({
            name: 'James'
          });
          b = Hiraya.Class.create({
            name: 'Doris'
          });
          c = Hiraya.Collection.create();
          c.add(a);
          c.add(b);
          return expect(c.length).to.be(2);
        });
      });
    });
  });

}).call(this);
