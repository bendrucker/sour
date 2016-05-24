'use strict'

var test = require('tape')
var Router = require('../')

test('path revert', function (t) {
  t.plan(2)

  var state = Router({
    path: '/package'
  })
  var route = Router.route(state, {
    path: '/package',
    render: function () {
      return 'sour'
    }
  })

  Router.beforeEnter(state, route, function (params, callback) {
    t.pass('hook called once')
    callback()
  })

  Router.watch(state, onReady)

  function onReady () {
    state.path.set('/bad')
    t.equal(state.path(), '/package')
  }
})
