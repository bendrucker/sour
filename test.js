'use strict'

var test = require('tape')
var Observ = require('observ')
var watch = require('observ/watch')
var Sour = require('./')

test('initialization', function (t) {
  var state = Sour()

  t.equal(state().path, '/', 'path defaults to "/"')
  t.equal(state().listening, false, 'not listening by default')

  Sour.route(state, {
    path: '/',
    render: function () {
      return true
    }
  })
  var stopWatching = Sour.watch(state)
  t.equal(state().listening, true, 'sets listening to true when it starts listening')
  t.ok(state().active, 'has an active entry')
  t.ok(Sour.render(state()), 'render returns proper data from syncronous call')

  setTimeout(function () {
    t.ok(Sour.render(state()), 'render returns proper data')
    t.ok(state().active, 'has an active entry')

    stopWatching()
    t.equal(state().listening, false, 'sets listening to false when watching is canceled')
    t.end()
  }, 500)
})

test(function (t) {
  t.plan(8)

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

  Sour.hook(state, function (callback) {
    t.pass('global hook')
    callback()
  })

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
