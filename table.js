'use strict'

var Routington = require('routington')
var createStore = require('weakmap-shim/create-store')

module.exports = RoutingTable

function RoutingTable () {
  var router = Routington()
  var store = createStore()

  return {
    add: add,
    get: get,
    match: match
  }

  function add (options) {
    var node = router.define(options.path)[0]
    var key = {}

    node.data = {
      key: key,
      render: options.render,
      hooks: []
    }

    store(key).hook = hook
    store(key).hooks = hooks

    return key

    function hook (fn) {
      node.data.hooks.push(fn)
    }

    function hooks (fn) {
      return node.data.hooks.slice()
    }
  }

  function get (key) {
    return store(key)
  }

  function match (path) {
    var matched = router.match(path)
    if (!matched) return null

    var node = matched.node

    return {
      key: node.data.key,
      render: node.data.render
    }
  }
}
