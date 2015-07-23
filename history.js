'use strict'

var window = require('global/window')
var history = window.history
var document = require('global/document')
var Event = require('geval')

exports.pushState = pushState
exports.onPopState = PopState()

function pushState (path) {
  if (!history) return
  history.pushState(undefined, document.title, path)
}

function PopState () {
  if (!history) return noop
  return Event(function (broadcast) {
    window.addEventListener('popstate', onPopState)
    function onPopState () {
      broadcast(document.location.pathname)
    }
  })
}

function noop () {}
