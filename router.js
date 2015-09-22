'use strict'

var Routington = require('routington')

module.exports = RouteMatcher

function RouteMatcher (routes) {
  var router = Routington()

  Object.keys(routes).forEach(function createRoute (route) {
    var node = router.define(route)[0]
    node.render = routes[route]
  })

  return function match (path) {
    var matched = router.match(path)
    return matched && matched.node.render && {
      params: matched.param,
      render: matched.node.render
    }
  }
}
