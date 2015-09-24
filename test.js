'use strict'

var test = require('tape')
var Sour = require('./')
var Router = require('./router')

test('integration', function (t) {
  t.plan(3)
  var state = Sour()
  var routes = {}
  function render (callback) {
    callback(Sour.render(state(), routes))
  }
  routes = {
    '/': function () {
      return 'Home'
    },
    '/posts': function () {
      return 'Posts'
    },
    '/posts/:id': function (params) {
      return 'Post ' + params.id
    }
  }

  state.set('/')
  render(function (content) {
    t.equal(content, 'Home')
  })

  state.set('/posts')
  render(function (content) {
    t.equal(content, 'Posts')
  })

  state.set('/posts/123')
  render(function (content) {
    t.equal(content, 'Post 123')
  })
})

test('route matching', function (t) {
  var match = Router({
    '/page/:id': render
  })
  t.deepEqual(match('/page/123'), {
    params: {id: '123'},
    render: render
  })
  t.notOk(match('/page'))
  t.end()
  function render () {}
})
