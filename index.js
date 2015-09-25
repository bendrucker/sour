'use strict'

var Struct = require('observ-struct')
var Path = require('observ-path')
var watch = require('observ/watch')
var createStore = require('weakmap-shim/create-store')
var Event = require('weakmap-event')
var Table = require('./table')
var View = require('./view')

module.exports = Router

function Router (data) {
  data = data || {}

  var state = Struct({
    path: Path(data.path),
    route: Observ(),
    pending: Observ(true)
  })

  var table = Table()
  store(state).table

  watch(path, function onChange (path) {
    var match = table.match(path)
    if (!match) return NotFoundEvent.broadcast(state, {
      path: path
    })

  })

  return state
}

var NotFoundEvent = Event()
Router.onNotFound = NotFoundEvent.listen

var store = createStore()

Router.route = function route (state, options) {
  return routes(state).add(options)
}

Router.hook = function hook (state, route, callback) {
  routes(state).get(route).hook(callback)
}

Router.render = function render (state) {
  if (state.pending) return

}

function routes (state) {
  return store(state).table
}

