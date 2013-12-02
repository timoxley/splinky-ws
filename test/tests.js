var buster = require('bustermove')
  , assert = buster.assert
  , server = require('./server')
  , after  = require('after')

var ws1Connections = 0
  , ws2Connections = 0
  , ws1concb
  , ws2concb
  , ws1msgcb
  , ws2msgcb

function ws1Controller (server) {
  server.on('connection', function (socket) {
    ws1Connections++
    ws1concb && ws1concb(socket)
    socket.on('message', function (msg) {
      ws1msgcb && ws1msgcb(msg)
    })
    socket.on('close', function () {
    })
  })
}

function ws2Controller (server) {
  server.on('connection', function (socket) {
    ws2Connections++
    ws2concb && ws2concb(socket)
    socket.on('message', function (msg) {
      ws2msgcb && ws2msgcb(msg)
    })
    socket.on('close', function () {
    })
  })
}

buster.testCase('splinky-ws', {
    'setUp': function (done) {
      server(ws1Controller, ws2Controller, function (err, splinky) {
        this.splinky = splinky
        console.error('QUICK! Go point your browser at http://localhost:' + server.port + '/')
        done()
      }.bind(this))
    }

  , 'tearDown': function (done) {
      this.splinky.close(done)
    }

  , 'test websockets': function (_done) {
      this.timeout = 1000 * 60

      var done = after(2, function (err) {
            setTimeout(_done, 500)
          })
        , ping1
        , ping2

      ws1concb = function (socket) {
        socket.send(JSON.stringify({ 'WS1PING': ping1 = Date.now() }))
      }
      ws2concb = function (socket) {
        socket.send(JSON.stringify({ 'WS2PING': ping2 = Date.now() }))
      }
      ws1msgcb = function (msg) {
        var data = JSON.parse(msg)
        assert.equals(ping1, data.WS1PING)
        done()
      }
      ws2msgcb = function (msg) {
        var data = JSON.parse(msg)
        assert.equals(ping2, data.WS2PING)
        done()
      }
    }
})
