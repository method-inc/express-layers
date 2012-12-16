var express = require('express');
var assert = require('chai').assert;
var request = require('superagent');

var layers = require('../');

describe('layers', function() {
  it('should allow injection of middleware into the layer', function(done) {
    var app = express();

    layers(app);

    app.use(start);
    app.use(tag('a'));
    app.lay('myLayer');
    app.lay('myLayer', tag('b'));
    app.use(tag('c'));
    app.lay('myLayer', tag('d'));
    app.use(tag('e'));
    app.use(complete);
    app.lay('myLayer', tag('f'));

    var server = app.listen(3000);

    request
      .get('http://localhost:3000')
      .end(function(res) {
        assert.strictEqual(res.text, 'abdfce');
        server.close();
        return done();
      });
  });

  it('should pass errors onto error middleware', function(done) {
    var app = express();

    layers(app);

    app.use(start);
    app.use(tag('a'));
    app.lay('myLayer');
    app.use(tag('b'));
    app.use(complete);
    app.use(handleError);

    app.lay('myLayer', tag('c'));
    app.lay('myLayer', createError);

    var server = app.listen(3000);

    request
      .get('http://localhost:3000')
      .end(function(res) {
        assert.strictEqual(res.text, 'acERROR');
        server.close();
        return done();
      });
  });
});

function start(req, res, next) {
  req.order = '';
  return next();
}

function tag(label) {
  return function middle(req, res, next) {
    req.order += label;
    return next();
  };
}

function complete(req, res, next) {
  return res.send(req.order);
}

function handleError(err, req, res, next) {
  return res.send(req.order + 'ERROR');
}

function createError(req, res, next) {
  return next(new Error('This is an error'));
}
