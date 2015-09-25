'use strict'

var test = require('tape')
var Observ = require('observ')
var watch = require('observ/watch')
var Sour = require('./')

test(function (t) {
  t.plan(6)

  var state = Sour({
    path: '/users/123'
  })
  var me = Observ()

  var user = Sour.route(state, {
    path: '/users/:id',
    render: function () {
      return 'I am user ' + me().id
    }
  })

  t.equal(user.path, '/users/:id')
  t.notOk(user.render, 'route key is a copy without render')

  Sour.hook(state, user, function (params, callback) {
    t.deepEqual(params, {
      id: '123'
    })
    fetch(params, function (err, data) {
      if (err) return callback(err)
      me.set(data)
      callback(null)
    })
  })

  var i = 0
  watch(state.active, function () {
    if (!i++) return t.equal(Sour.render(state()), undefined)
    t.equal(Sour.render(state()), 'I am user 0')
  })

  Sour.onNotFound(state, function (data) {
    t.equal(data.path, '/not/defined')
  })

  Sour.watch(state)

  state.path.set('/not/defined')

  function fetch (options, callback) {
    process.nextTick(function () {
      callback(null, {id: 0})
    })
  }
})
