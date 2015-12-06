'use strict'

var test = require('tape')
var Router = require('../')

test('global hook', function (t) {
  t.plan(2)

  var state = Router({
    path: '/packages/sour'
  })
  var value = null

  Router.route(state, {
    path: '/packages/:name',
    render: function () {
      return value
    }
  })

  Router.hook(state, 'enter.before', function (params, callback) {
    t.deepEqual(params, {name: 'sour'})
    value = 'hooked'
    callback()
  })

  state.active(function onChange () {
    t.equal(Router.render(state()), 'hooked')
  })

  Router.watch(state)
})
