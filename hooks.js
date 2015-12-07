'use strict'

var WeakStore = require('weakmap-shim/create-store')
var Hooks = require('route-hook')
var assign = require('xtend/mutable')
var get = require('value-get')

var store = WeakStore()

module.exports = {
  create: createHooks,
  add: addHook,
  get: getHooks
}

function createHooks (key) {
  assign(store(key), Hooks())
}

function addHook (key, type, fn) {
  return getHooks(type, key).add(fn)
}

function getHooks (type, key) {
  return get(type, store(key))
}
