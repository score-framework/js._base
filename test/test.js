if (typeof loadScore === 'undefined') {
    var loadScore = function(callback) {
        var score = require('../_base.js');
        delete require.cache[require.resolve('../_base.js')];
        callback(score);
    };
}

if (typeof expect === 'undefined') {
    var expect = require('expect.js');
}

describe('loadScore', function() {
    it('should load empty score base', function(done) {
        loadScore(function(localScore) {
            expect(localScore).to.be.an('object');
            done();
        });
    });
    it('should load a new score on each call', function(done) {
        loadScore(function(score1) {
            loadScore(function(score2) {
                expect(score1).to.not.equal(score2);
                done();
            });
        });
    });
});

describe('score', function() {

    describe('#extend()', function() {

        it('should assign return value to score', function(done) {
            loadScore(function(score) {
                expect(score.foo).to.be(undefined);
                score.extend('foo', [], function(score2) {
                    expect(score).to.equal(score2);
                    return 81;
                });
                expect(score.foo).to.equal(81);
                done();
            });
        });

        it("should not load modules with missing dependencies", function(done) {
            loadScore(function(score) {
                expect(score.foo).to.be(undefined);
                score.extend('foo', ['bar'], function(score) {
                    expect().fail("Module loaded without dependencies");
                    done();
                });
                expect(function() { var x = score.foo; }).to.throwError();
                done();
            });
        });

        it("should be able to handle nested modules", function(done) {
            loadScore(function(score) {
                expect(score.foo).to.be(undefined);
                var barLoaded = false;
                var fooBarLoaded = false;
                score.extend('foo', ['bar'], function(score) {
                    expect(barLoaded).to.be(true);
                    expect(fooBarLoaded).to.be(false);
                    expect(score.bar).to.be('frobination');
                    fooBarLoaded = true;
                    return 81;
                });
                expect(function() { var x = score.foo; }).to.throwError();
                expect(barLoaded).to.be(false);
                expect(fooBarLoaded).to.be(false);
                score.extend('bar', [], function(score) {
                    expect(barLoaded).to.be(false);
                    expect(fooBarLoaded).to.be(false);
                    barLoaded = true;
                    return 'frobination';
                });
                expect(barLoaded).to.be(true);
                expect(fooBarLoaded).to.be(true);
                expect(score.foo).to.equal(81);
                done();
            });
        });

        it("should wait for parent modules before loading submodules", function(done) {
            loadScore(function(score) {
                expect(score.foo).to.be(undefined);
                score.extend('foo.bar', [], function(score2) {
                    expect().fail("Module loaded without dependencies");
                    done();
                });
                expect(function() { var x = score.foo; }).to.throwError();
                done();
            });
        });

        it("should be able to handle nested modules recursively", function(done) {
            loadScore(function(score) {
                expect(score.foo).to.be(undefined);
                var fooLoaded = false;
                var fooBarLoaded = false;
                var fooBarBazLoaded = false;
                score.extend('foo', [], function(score2) {
                    expect(fooLoaded).to.be(false);
                    expect(fooBarLoaded).to.be(false);
                    expect(fooBarBazLoaded).to.be(false);
                    fooLoaded = true;
                    return {baz: 'frobination'};
                });
                expect(fooLoaded).to.be(true);
                expect(fooBarLoaded).to.be(false);
                expect(fooBarBazLoaded).to.be(false);
                score.extend('foo.bar', [], function(score2) {
                    expect(fooLoaded).to.be(true);
                    expect(fooBarLoaded).to.be(false);
                    expect(fooBarBazLoaded).to.be(false);
                    fooBarLoaded = true;
                    expect(score.foo).to.eql({baz: 'frobination'});
                    return {};
                });
                expect(fooLoaded).to.be(true);
                expect(fooBarLoaded).to.be(true);
                expect(fooBarBazLoaded).to.be(false);
                score.extend('foo.bar.baz', [], function(score2) {
                    expect(fooLoaded).to.be(true);
                    expect(fooBarLoaded).to.be(true);
                    expect(fooBarBazLoaded).to.be(false);
                    fooBarBazLoaded = true;
                    expect(score.foo.bar).to.eql({});
                    return 42;
                });
                expect(fooLoaded).to.be(true);
                expect(fooBarLoaded).to.be(true);
                expect(fooBarBazLoaded).to.be(true);
                expect(score.foo).to.eql({baz: 'frobination', bar: {baz: 42}});
                done();
            });
        });

        it("should be able to handle nested modules defined in the arbitrary order", function(done) {
            loadScore(function(score) {
                expect(score.foo).to.be(undefined);
                var fooLoaded = false;
                var fooBarLoaded = false;
                var fooBarBazLoaded = false;
                score.extend('foo.bar.baz', [], function(score2) {
                    expect(fooLoaded).to.be(true);
                    expect(fooBarLoaded).to.be(true);
                    expect(fooBarBazLoaded).to.be(false);
                    fooBarBazLoaded = true;
                    expect(score.foo.bar).to.eql({});
                    return 42;
                });
                expect(fooLoaded).to.be(false);
                expect(fooBarLoaded).to.be(false);
                expect(fooBarBazLoaded).to.be(false);
                score.extend('foo', [], function(score2) {
                    expect(fooLoaded).to.be(false);
                    expect(fooBarLoaded).to.be(false);
                    expect(fooBarBazLoaded).to.be(false);
                    fooLoaded = true;
                    return {baz: 'frobination'};
                });
                expect(fooLoaded).to.be(true);
                expect(fooBarLoaded).to.be(false);
                expect(fooBarBazLoaded).to.be(false);
                score.extend('foo.bar', [], function(score2) {
                    expect(fooLoaded).to.be(true);
                    expect(fooBarLoaded).to.be(false);
                    expect(fooBarBazLoaded).to.be(false);
                    fooBarLoaded = true;
                    expect(score.foo).to.eql({baz: 'frobination'});
                    return {};
                });
                expect(fooLoaded).to.be(true);
                expect(fooBarLoaded).to.be(true);
                expect(fooBarBazLoaded).to.be(true);
                expect(score.foo).to.eql({baz: 'frobination', bar: {baz: 42}});
                done();
            });
        });

        it("should be able to handle nested modules defined in the reverse order", function(done) {
            loadScore(function(score) {
                expect(score.foo).to.be(undefined);
                var fooLoaded = false;
                var fooBarLoaded = false;
                var fooBarBazLoaded = false;
                score.extend('foo.bar.baz', [], function(score2) {
                    expect(fooLoaded).to.be(true);
                    expect(fooBarLoaded).to.be(true);
                    expect(fooBarBazLoaded).to.be(false);
                    fooBarBazLoaded = true;
                    expect(score.foo.bar).to.eql({});
                    return 42;
                });
                expect(fooLoaded).to.be(false);
                expect(fooBarLoaded).to.be(false);
                expect(fooBarBazLoaded).to.be(false);
                score.extend('foo.bar', [], function(score2) {
                    expect(fooLoaded).to.be(true);
                    expect(fooBarLoaded).to.be(false);
                    expect(fooBarBazLoaded).to.be(false);
                    fooBarLoaded = true;
                    expect(score.foo).to.eql({baz: 'frobination'});
                    return {};
                });
                expect(fooLoaded).to.be(false);
                expect(fooBarLoaded).to.be(false);
                expect(fooBarBazLoaded).to.be(false);
                score.extend('foo', [], function(score2) {
                    expect(fooLoaded).to.be(false);
                    expect(fooBarLoaded).to.be(false);
                    expect(fooBarBazLoaded).to.be(false);
                    fooLoaded = true;
                    return {baz: 'frobination'};
                });
                expect(fooLoaded).to.be(true);
                expect(fooBarLoaded).to.be(true);
                expect(fooBarBazLoaded).to.be(true);
                expect(score.foo).to.eql({baz: 'frobination', bar: {baz: 42}});
                done();
            });
        });

        if (typeof loadScoreWithRequireJs === 'function') {
            it("should work using require.js", function(done) {
                loadScoreWithRequireJs(function(score) {
                    expect(score).to.be.an('object');
                    expect(score.foo).to.be(undefined);
                    expect(score.extend).to.be.a('function');
                    done();
                });
            });
        }

    });

});
