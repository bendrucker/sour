'use strict'

var test = require('tape')
var Router = require('../')

test('render', function (t) {
  t.test('simple', function (t) {
    t.plan(1)

    var state = Router()

    Router.route(state, {
      path: '/',
      render: function (a, b) {
        return [a, b, 'sour'].join('.')
      }
    })

    state.active(function onChange () {
      t.equal(Router.render(state(), 'foo', 'bar'), 'foo.bar.sour')
    })

    Router.watch(state)
  })
})
