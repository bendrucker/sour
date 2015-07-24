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

test('router (browser) - set path', function (t) {
  t.plan(2)
  var Router = proxyquire('../router', {
    'global/document': {
      location: {pathname: '/the/initial/path'}
    },
    './history': {
      onPopState: noop,
      pushState: function (path) {
        t.equal(path, '/the/set/path')
      }
    }
  })
  var router = Router()
  t.equal(router(), '/the/initial/path')
  router.set('/the/set/path')
})

test('router (browser) - pop state', function (t) {
  var onPopState
  var Router = proxyquire('../router', {
    'global/document': {},
    './history': {
      onPopState: function (callback) {
        onPopState = callback
      },
      pushState: t.fail.bind(t, 'pushState not called when pop is handled')
    }
  })
  var router = Router()
  onPopState('/the/popped/path')
  t.equal(router(), '/the/popped/path')
  t.end()
})

function noop () {}
