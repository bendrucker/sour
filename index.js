'use strict'

var Struct = require('observ-struct')
var Observ = require('observ')
var Path = require('observ-path')
var Table = require('tafel')
var series = require('run-series')
var partial = require('ap').partial
var Event = require('weakmap-event')
var filter = require('filter-pipe')
var watchIf = require('observ-listen-if/watch')
var createStore = require('weakmap-shim/create-store')
var Hooks = require('route-hook')
var assign = require('xtend/mutable')
var get = require('value-get')
var nextTick = require('next-tick')

module.exports = Router

var store = createStore()

function Router (data) {
  data = data || {}

  var state = Struct({
    path: Path(data.path),
    watching: Observ(false),
    active: Observ(),
    params: Observ({})
  })

  createTable(state)
  createHooks(state)

  watchIf(
    state.watching,
    state.path,
    partial(onPath, state)
  )

  return state
}

var NotFoundEvent = Event()
Router.onNotFound = NotFoundEvent.listen

var ErrorEvent = Event()
Router.onError = ErrorEvent.listen

Router.watch = function watch (state) {
  state.watching.set(true)
}

function onPath (state, path) {
  var match = routes(state).match(path)
  if (!match) {
    return NotFoundEvent.broadcast(state, {
      path: path
    })
  }
  Router.transition(state, match.key, match.params)
}

Router.transition = function transition (state, route, params, callback) {
  var current = hooks(state, state.active(), state.params())
  var next = hooks(state, route, params)
  var fail = partial(ErrorEvent.broadcast, state)
  callback = callback || noop

  series([
    partial(current, 'leave.before'),
    partial(current, 'leave.after'),
    partial(next, 'enter.before'),
    enter
  ], done)

  function enter (callback) {
    activate(state, route, params)
    callback(null)
    next('enter.after', filter(Boolean, fail))
  }

  function done (err) {
    if (err) fail(err)
    callback(err)
  }
}

Router.route = function route (state, options) {
  return routes(state).add(options)
}

Router.hook = function hook (state, route, type, fn) {
  if (typeof route === 'string') {
    fn = type
    type = route
    route = null
  }
  return get(type, store(route || state).hooks).add(fn)
}

Router.render = function render (state) {
  if (!state.active) return
  return store(state.active).render()
}

function activate (state, route, params) {
  state.active.set(route)
  state.params.set(params)
}

function createTable (state) {
  store(state).table = Table()
}

function table (state) {
  return store(state).table
}

function routes (state) {
  return {
    add: add,
    match: match
  }

  function add (options) {
    var key = table(state).add(options.path)
    assign(store(key), options, {
      hooks: Hooks()
    })
    return key
  }

  function match (path) {
    return table(state).match(path)
  }
}

function createHooks (state) {
  store(state).hooks = Hooks()
}

function hooks (state, route, params) {
  if (!route) return noopHook

  return function runner (type, callback) {
    series([run(state, params), run(route, params)], callback)

    function run (key, arg) {
      return partial(get(type, store(key).hooks), arg)
    }
  }
}

function noopHook (type, callback) {
  nextTick(callback)
}

function noop () {}
