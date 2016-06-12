'use strict'

var test = require('tape')
var Router = require('../')

test('get path for route with params', function (t) {
  var state = Router()
  var route = Router.route(state, {
    path: '/foo/:id',
    render: function () {
      return 'foo!'
    }
  })

  t.equal(Router.path(state, route, {id: 1}), '/foo/1')

  // invalid key
  t.throws(function () {
    Router.path(state, {}, {id: 1})
  })

  // no params
  t.throws(function () {
    Router.path(state, route)
  })
  t.end()
})

test('get path for route with no params', function (t) {
  var state = Router()
  var route = Router.route(state, {
    path: '/bar',
    render: function () {
      return 'bar!'
    }
  })

  t.equal(Router.path(state, route), '/bar')
  t.end()
})
