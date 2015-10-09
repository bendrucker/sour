'use strict'

var Struct = require('observ-struct')
var Observ = require('observ')
var Path = require('observ-path')
var observWatch = require('observ/watch')
var createStore = require('weakmap-shim/create-store')
var Event = require('weakmap-event')
var series = require('run-series')
var partial = require('ap').partial
var Table = require('./table')

module.exports = Router

function Router (data) {
  data = data || {}

  var state = Struct({
    path: Path(data.path),
    listening: Observ(false),
    active: Observ()
  })

  var internals = store(state)
  internals.table = Table()
  internals.hooks = []

  return state
}

Router.watch = function watch (state) {
  if (state.listening()) return

  var table = routes(state)

  return observWatch(state.path, function onPath (path) {
    var match = routes(state).match(path)

    if (!match) {
      return NotFoundEvent.broadcast(state, {
        path: path
      })
    }

    var globalHooks = store(state).hooks
    var hooks = globalHooks.concat(table.get(match.key).hooks())

    series(hooks.map(function (hook) {
      return partial(hook, match.params)
    }), done)

    function done (err) {
      if (err) return ErrorEvent.broadcast(state, err)
      store(match.key).render = match.render
      state.active.set(match.key)
    }
  })
}

var NotFoundEvent = Event()
Router.onNotFound = NotFoundEvent.listen

var ErrorEvent = Event()
Router.onError = ErrorEvent.listen

var store = createStore()

Router.route = function route (state, options) {
  return routes(state).add(options)
}

Router.hook = function hook (state, route, callback) {
  if (typeof route === 'function') {
    callback = route
    store(state).hooks.push(callback)
  } else {
    routes(state).get(route).hook(callback)
  }
}

Router.render = function render (state) {
  if (!state.active) return
  var renderPage = store(state.active).render
  return renderPage ? renderPage() : undefined
}

function routes (state) {
  return store(state).table
}
