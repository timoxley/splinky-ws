## Splinky-WS

**WebSockets for [Splinky](https://github.com/rvagg/splinky)**

Uses [Engine.IO](https://github.com/LearnBoost/engine.io) to expose raw (relatively) WebSockets, you'll need to add sugar on top as required.

### Usage

**Splinky-WS** exposes a simple helper function that will register startup and shutdown handlers to Splinky for you:

```js
var splinkyWs = require('splinky-ws')
var splinky = require('splinky')({ port: 1337 })

splinkyWs(splinky)

// ... other Splinky config

splinky.listen()
```

Once you have **Splinky-WS** injected into a Splinky server you can write WebSocket handlers!

```js
function wsHandler (server) {
  server.on('connection', function (socket) {
    socket.on('message', function (msg) {
      socket.send('pong: ' + msg)
    })
    socket.on('close', function () {
    	// ...
    })
  })
}

wsHandler.$config = {
  category: 'ws',
  path: '/splinky-websockets'
}

splinky.reg(wsHandler) // or perhaps make it available for a splinky.scan()
```

You can have multiple WS handlers in a Splinky server as long as you mount them at different `path`s. Remember to also supply a `{ path: '/...' }` to match the path you specify in our handler config.

Use [engine.io-stream](https://github.com/Raynos/engine.io-stream/) if you want to turn your WS connection into a proper stream:

```js
var EngineStream = require("engine.io-stream/eiostream")

function wsHandler (server) {
  server.on('connection', function (socket) {
    var stream = EngineStream(socket)
    // ...
  })
}

// ...
```

## License

**Splink-WS** is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.