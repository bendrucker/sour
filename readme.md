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

Sour.beforeEnter(state, hello, function (params, callback) {
  //=> I run before the "hello" route is rendered
  callback(null)
})

Sour.watch(state)
//=> Observe path changes and update the active route

state(function (state) {
  console.log(Sour.render(state))  
})
```

## API

### Initialization

#### `Sour([data])` -> `state`

Returns an [observable](https://github.com/raynos/observ) representation of the state.

##### data.path

Type: `string`  
Default: `document.location.pathname`

The initial path to use. In the browser, this defaults to the current page path. In Node, it defaults to `''`. 

#### `Sour.watch(state)` -> `function`

Watches for path changes to update the active route. Returns an unwatch function.

### Routing

#### `Sour.route(state, options)` -> `object`

Defines a new route, returning the route key that can later be referenced to create hooks or change routes.

##### options

###### path

*Required*  
Type: `string`

A path string provided to [routington](https://github.com/pillarjs/routington).

###### render

*Required*  
Type: `function`

The render function for the route.

#### `Sour.transition(state, route, params, callback)` -> `undefined`

Transitions the router to the specified route returned by `Sour.route`. 

##### state

*Required*

The router state.

##### route

*Required*  
Type: `object`

A route returned from `Sour.route`.

##### params

*Required*  
Type: `object`

Parameters for the route. These are passed to any registered route hooks.

##### callback

Type: `function`  
Default: `noop`  
Arguments: `err`

A callback that will be called after the transition completes. A route transition is complete when:

* `beforeLeave` hooks finish
* `afterLeave` hooks finish
* `beforeEnter` hooks finish
* the active route is updated

The `afterEnter` hook for the destination route will be run after the transition completes.

### Rendering

#### `Sour.render(state, [args...])` -> `any`

Runs the `render` function defined via `Sour.route` for the active route and returns its result. 

##### state

*Required*  
Type: `object`

The current state of the router. If no active route is found, `undefined` is returned.

##### args...

A variadic set of arguments. These arguments are passed to your active `render` function.

### Hooks

Hooks provide a way to add custom behavior that runs at different points in the routing lifecycle. 

#### `Sour.beforeEnter(state, [route], callback)` -> `function`
#### `Sour.afterEnter(state, [route], callback)` -> `function`
#### `Sour.beforeLeave(state, [route], callback)` -> `function`
#### `Sour.afterLeave(state, [route], callback)` -> `function`

Enter and leave hooks run asynchronously when moving between valid routes. Each hook method returns an unlisten function that will unregister the hook.

##### state

The router state.

##### route

The route key object returned by `Sour.route`. If no route is provided, the hook will run for every route.

##### callback

*Required*  
Type: `function`  
Arguments: `params, callback`

A callback that will be called when the specified route is activated. Hooks are called in the order in which they were registered with the arguments `params, callback`, where:

* `params` are path parameters defined by the path definition string.
* `callback`: a function of `err` that can halt the route transition and must be called to continue route activation.

#### `Sour.onNotFound(state, listener)` -> `function`

##### listener

*Required*  
Type: `function`  
Arguments: `{path}`

Called when the current path does not match any routes. Returns an unlisten function.

#### `Sour.onError(state, listener)` -> `function`

##### listener

*Required*  
Type: `function`  
Arguments: `err`

Called when any hook errors during a transition. Returns an unlisten function.

## License

MIT © [Ben Drucker](http://bendrucker.me)
