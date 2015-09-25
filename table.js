'use strict'

var Routington = require('routington')
var extend = require('xtend')
var CreateStore = require('weakmap-shim/create-store')

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
    node.data = {
      render: options.render,
      hooks: []
    }

    var key = extend(options)
    store(key).hook = hook

    return key

    function hook (fn) {
      node.data.hooks.push(fn)
    }
  }

  function get (key) {
    return store(key)
  }

  function match (path) {
    var matched = router.match(path)
    if (!matched) return null

    return {
      render: node.render,
      params: matched.param
    }
  }
}
