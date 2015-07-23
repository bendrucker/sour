'use strict'

var test = require('tape')
var proxyquire = require('proxyquire')
var EventTarget = require('dom-event-target')

test('history (server)', function (t) {
  var history = proxyquire('../history', {
    'global/window': {},
    'global/document': {}
  })
  t.doesNotThrow(history.pushState, 'pushState is a noop')
  t.doesNotThrow(history.onPopState, 'onPopState is a noop')
  t.end()
})

test('history (browser)', function (t) {
  t.plan(4)

  var window = new EventTarget()
  var document = {
    title: 'the title',
    location: {
      pathname: '/the/popped/path'
    }
  }
  window.history = {
    pushState: pushState
  }
  var history = proxyquire('../history', {
    'global/window': window,
    'global/document': document
  })

  history.pushState('/the/pushed/path')
  function pushState (state, title, path) {
    t.notOk(state)
    t.equal(title, 'the title')
    t.equal(path, '/the/pushed/path')
  }

  history.onPopState(onPopState)
  window.send('popstate')
  function onPopState (path) {
    t.equal(path, '/the/popped/path')
  }
})
