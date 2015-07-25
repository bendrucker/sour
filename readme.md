# sour [![Build Status](https://travis-ci.org/bendrucker/sour.svg?branch=master)](https://travis-ci.org/bendrucker/sour)

> Router for functional rendering UIs

sour is designed for use in both Node and the browser. It handles history manipulation in the browser and provides a uniform API for transitioning to a route whether you're running in Node or a browser. Routing is handled by [routington](https://github.com/pillarjs/routington).


## Install

```
$ npm install --save sour
```


## Usage

```js
var Router = require('sour')
var state = Router()

console.log(state())
//=> /the/current/path

var content = Router.render(state, {
  '/': function () {
    return 'Home'
  },
  '/posts': function () {
    return 'Post'
  },
  '/posts/:id': function (params) {
    return 'Post ' + params.id
  }
})
```

## API

#### `Router([path])` -> `state`

Returns an [observable](https://github.com/raynos/observ) representation of the state.

##### path

Type: `string`  
Default: `document.location.pathname`

The initial path to use. In the browser, this defaults to the current page path. In node, it defaults to `''`. 

#### `Router.render(state, routes)` -> `any`

##### state

*Required*  
Type: `string`

The current path of the router.

##### routes

*Required*  
Type: `object`

A routes object where the keys are route definitions to be passed to [routington](https://github.com/pillarjs/routington) and the values are functions that return the rendered content for the specified route. The functions will optionally receive a `params` object representing the path parameters when parameters are included in the route.


## License

MIT © [Ben Drucker](http://bendrucker.me)
