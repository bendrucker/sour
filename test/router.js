'use strict'

var test = require('tape')
var Router = require('../router')

test('route matching', function (t) {
  var match = Router({
    '/page/:id': render
  })
  t.deepEqual(match('/page/123'), {
    params: {id: '123'},
    fn: render
  })
  t.notOk(match('/page'))
  t.end()
  function render () {}
})
