# sour [![Build Status](https://travis-ci.org/bendrucker/sour.svg?branch=master)](https://travis-ci.org/bendrucker/sour)

> Router for functional rendering UIs

sour is a standalone functional router that works in Node and the browser. It provides the state management and lifecycle hooks you'll use in your application. Sour is designed for composition. You should build your own application-specific routing layer that uses sour internally. Routing is handled by [routington](https://github.com/pillarjs/routington).


## Install

```
$ npm install --save sour
```


## Usage

```js
var Sour = require('sour')
var state = Sour()

console.log(state.path())
//=> /the/current/path

var hello = Sour.route(state, {
  path: '/the/route/path',
  render: function () {
    return 'Hello world!'
  }
})

Sour.hook(state, hello, function (params, callback) {
  //=> I run before the "hello" route is rendered
  callback(null)
})

Sour.listen(state)
//=> Listen to path changes and update the active route

state(function (state) {
  console.log(Sour.render(state))  
})
```

## API

#### `Sour([data])` -> `state`

Returns an [observable](https://github.com/raynos/observ) representation of the state.

##### data.path

Type: `string`  
Default: `document.location.pathname`

The initial path to use. In the browser, this defaults to the current page path. In Node, it defaults to `''`. 

#### `Sour.render(state)` -> `any`

##### state

*Required*  
Type: `object`

The current state of the router. If no active route is found, `undefined` is returned.

#### `Sour.watch(state)` -> `function`

Watches for path changes to update the active route. Returns an unwatch function.

#### `Sour.route(state, options)` -> `object`

Defines a new route, returning the route key that can later be passed to `hook`.

##### options

###### path

*Required*  
Type: `string`

A path string provided to [routington](https://github.com/pillarjs/routington).

###### render

*Required*  
Type: `function`

The render function for the route.

#### `Sour.hook(state, route, callback)` -> `undefined`

##### state

The router state.

##### route

The route key object returned by `Sour.route`.

##### callback

*Required*  
Type: `function`  
Arguments: `params, callback`

A callback that will be called when the specified route is activated. Hooks are called in the order in which they were registered with the arguments `params, callback`, where:

* `params` are path parameters defined by the path definition string.
* `callback`: a function of `err` that can halt the route transition and must be called to continue route activation.

#### `Sour.onNotFound(state, listener)` -> `function`

Calls a `listener` function with `{path}` when an unknown route is set. Returns an unlisten function.

#### `Sour.onError(state, listener)` -> `function`

Calls a `listener` function with `err` when hook throws during a transition. Returns an unlisten function.

## License

MIT © [Ben Drucker](http://bendrucker.me)
