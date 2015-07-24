'use strict'

var Observ = require('observ')
var location = require('global/document').location
var history = require('./history')

module.exports = Router

function Router (data) {
  data = data || {}
  var state = Observ(data.path || location ? location.pathname : '')
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
