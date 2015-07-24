'use strict'

var test = require('tape')
var proxyquire = require('proxyquire')

test('router (server)', function (t) {
  var Router = proxyquire('../router', {
    'global/document': {},
    './history': {
      onPopState: noop,
      pushState: noop
    }
  })
  var router = Router()
  t.equal(router(), '')
  t.end()
})

function noop () {}
