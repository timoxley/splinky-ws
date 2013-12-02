var Engine = require('engine.io-client')

var socket1 = new Engine.Socket('ws://localhost:1337', { path: '/ws1test' })
socket1.on('open', function () {
    socket1.on('message', function (msg) {
      var data = JSON.parse(msg)
      socket1.send(JSON.stringify({ WS1PING: data.WS1PING }))
    })
    socket1.on('close', function () {
    })
  })

var socket2 = new Engine.Socket('ws://localhost:1337', { path: '/ws2test' })
socket2.on('open', function () {
    socket2.on('message', function (msg) {
      var data = JSON.parse(msg)
      socket2.send(JSON.stringify({ WS2PING: data.WS2PING }))
    })
    socket2.on('close', function () {
    })
  })

