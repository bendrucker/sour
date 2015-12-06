'use strict'

var test = require('tape')
var Router = require('../')

test('render', function (t) {
  t.test('simple', function (t) {
    t.plan(1)

    var state = Router()

    Router.route(state, {
      path: '/',
      render: function () {
        return 'sour'
      }
    })

    state.active(function onChange () {
      t.equal(Router.render(state()), 'sour')
    })

    Router.watch(state)
  })
})
