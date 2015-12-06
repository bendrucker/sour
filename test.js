'use strict'

var test = require('tape')
var Router = require('./')

test('simple render', function (t) {
  t.plan(1)

  var state = Router({
    path: '/app'
  })

  Router.route(state, {
    path: '/app',
    render: function () {
      return 'sour'
    }
  })

  state.active(function onChange () {
    t.equal(Router.render(state()), 'sour')
  })

  Router.watch(state)
})

test('route not found', function (t) {
  t.plan(1)

  var state = Router()

  Router.onNotFound(state, function (data) {
    t.deepEqual(data, {path: '/'})
  })

  Router.watch(state)
})
