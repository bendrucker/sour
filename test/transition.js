'use strict'

var test = require('tape')
var Router = require('../')

test('transition', function (t) {
  t.test('success', function (t) {
    t.plan(4)

    var state = Router({
      path: '/packages/sour'
    })
    var value = ''

    var route = Router.route(state, {
      path: '/packages/:name',
      render: function () {
        t.fail('no render')
      }
    })

    Router.beforeEnter(state, function (params, callback) {
      t.deepEqual(params, {name: 'sour'})
      value = 'hooked'
      callback()
    })

    Router.transition(state, route, {name: 'sour'}, function (err) {
      if (err) return t.end(err)
      t.equal(state.active(), route)
      t.deepEqual(state.params(), {name: 'sour'})
      t.deepEqual(value, 'hooked')
    })
  })

  t.test('error', function (t) {
    t.plan(1)

    var state = Router({
      path: '/packages/sour'
    })

    var route = Router.route(state, {
      path: '/packages/:name',
      render: function () {
        t.fail('no render')
      }
    })

    var err = new Error('route err')

    Router.beforeEnter(state, function (params, callback) {
      callback(err)
    })

    Router.transition(state, route, {}, function (e) {
      t.equal(e, err)
    })
  })
})
