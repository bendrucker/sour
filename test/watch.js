'use strict'

var test = require('tape')
var Router = require('../')

test('watch', function (t) {
  t.plan(4)

  var state = Router()
  t.equal(state.watching(), false, 'not watching by default')

  var unwatch = Router.watch(state)
  t.equal(state.watching(), true, 'starts watching')
  t.equal(typeof unwatch, 'function', 'returns an unwatch function')

  Router.onNotFound(state, function (data) {
    t.deepEqual(data, {
      path: '/foo'
    })
  })
  state.path.set('/foo')
  unwatch()

  state.path.set('/bar') // noop
})

test('watch - done callback', function (t) {
  t.test('match', function (t) {
    t.plan(1)

    var state = Router({
      path: '/packages/sour'
    })
    Router.route(state, {
      path: '/packages/:name'
    })
    var pkg
    Router.beforeEnter(state, function (params, callback) {
      pkg = params.name
      callback()
    })

    Router.watch(state, function done () {
      t.equal(pkg, 'sour')
    })
  })

  t.test('no match', function (t) {
    t.plan(1)

    var state = Router()
    Router.watch(state, function done () {
      t.pass('called')
    })
  })

  t.end()
})
