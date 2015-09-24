'use strict'

var Path = require('observ-path')
var Matcher = require('./router')
var View = require('./view')

module.exports = Router

function Router (path) {
  return Path(path)
}

Router.render = function render (state, routes) {
  var match = Matcher(routes)
  return View.render(state, match)
}
