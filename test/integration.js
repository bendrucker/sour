'use strict'

var test = require('tape')
var Router = require('../')

test('integration', function (t) {
  t.plan(3)
  var state = Router()
  var routes = {}
  function render (callback) {
    callback(Router.render(state(), routes))
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
