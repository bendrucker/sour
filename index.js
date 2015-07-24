'use strict'

var Observ = require('observ')
var location = require('global/document').location
var history = require('./history')
var Matcher = require('./router')
var View = require('./view')

module.exports = Router

function Router (path) {
  var state = Observ(path || location ? location.pathname : '')
  var inPopState = false

  history.onPopState(onPopState)
  state(onChange)

  return state

  function onPopState (path) {
    inPopState = true
    state.set(path)
  }

  function onChange (path) {
    if (inPopState) {
      inPopState = false
      return
    }
    history.pushState(path)
  }
}

Router.render = function render (state, routes) {
  var match = Matcher(routes)
  return View.render(state, match)
}
