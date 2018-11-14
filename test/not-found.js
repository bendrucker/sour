'use strict'

var test = require('tape')
var Router = require('../')

test('route not found', function (t) {
  t.plan(1)

  var state = Router()

  Router.onNotFound(state, function (data) {
    t.deepEqual(data, { path: '/' })
  })

  Router.watch(state)
})
