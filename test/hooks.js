'use strict'

var test = require('tape')
var Router = require('../')

test('hooks', function (t) {
  t.test('global', function (t) {
    t.plan(2)

    var state = Router({
      path: '/packages/sour'
    })
    var values = []

    Router.route(state, {
      path: '/packages/:name',
      render: function () {
        return values.join(',')
      }
    })

    Router.beforeEnter(state, function (params, callback) {
      t.deepEqual(params, { name: 'sour' })
      process.nextTick(function () {
        values.push(0)
        callback()
      })
    })

    Router.beforeEnter(state, function (params, callback) {
      values.push(1)
      callback()
    })

    state.active(function onChange () {
      t.equal(Router.render(state()), '0,1')
    })

    Router.watch(state)
  })

  t.test('route', function (t) {
    t.plan(1)

    var state = Router({
      path: '/packages/sour'
    })
    var values = []

    var pkg = Router.route(state, {
      path: '/packages/:name',
      render: function () {
        return values.join(',')
      }
    })

    var other = Router.route(state, {
      path: '/other/route'
    })

    Router.beforeEnter(state, function (params, callback) {
      values.push(0, 1)
      callback()
    })

    Router.beforeEnter(state, pkg, function (params, callback) {
      values.push(2, 3)
      callback()
    })

    Router.beforeEnter(state, other, function () {
      t.fail('other route hook called')
    })

    state.active(function onChange () {
      t.equal(Router.render(state()), '0,1,2,3')
    })

    Router.watch(state)
  })

  t.test('error', function (t) {
    t.plan(1)

    var state = Router({
      path: '/packages/sour'
    })

    Router.route(state, {
      path: '/packages/:name',
      render: function () {
        t.fail('no render')
      }
    })

    var err = new Error('route error')

    Router.beforeEnter(state, function (params, callback) {
      callback(err)
    })

    Router.onError(state, function (e) {
      t.equal(e, err)
    })

    Router.watch(state)
  })
})
