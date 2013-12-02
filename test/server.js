const PORT       = 1337
    , Splinky    = require('splinky')
    , events     = require('events')
    , path       = require('path')
    , browserify = require('browserify')
    , splinkyWs  = require('../')
    , index      = path.join(__dirname, 'browserify.js')

function scriptController (context, callback) {
  context.setContentType('text/javascript')
  browserify(index).bundle().pipe(context.response)
  // don't touch callback, we'll handle the response thanks!
}
scriptController.$config = {
    category      : 'controller'
  , route         : '/script.js'
  , viewProcessor : 'toStringViewProcessor'
}

function simpleJSONController () {
  return { 'data': 'yes, this is some data' }
}
simpleJSONController.$config = {
    category      : 'controller'
  , route         : '/foo.json'
  , viewProcessor : 'jsonViewProcessor'
}

function server (ws1Controller, ws2Controller, callback) {
  ws1Controller.$config = {
      category : 'ws'
    , path     : '/ws1test'
  }
  ws2Controller.$config = {
      category : 'ws'
    , path     : '/ws2test'
  }

  var splinky     = Splinky({ port: PORT })
    , connections = []
  splinky.static({ path: __dirname, url: '/', cache: false, index: 'index.html' })
  splinky.reg(scriptController)
  splinky.reg(simpleJSONController)
  splinky.reg(ws1Controller)
  splinky.reg(ws2Controller)
  splinkyWs(splinky)
  splinky.listen(function () {
    callback(null, splinky)
  })
  splinky.splink.byId('httpServer', function (err, httpServer) {
    httpServer.on('connection', function (connection) {
      connections.push(connection)
    })
  })
  splinky._close = splinky.close
  splinky.close = function (callback) {
    connections.forEach(function (connection) {
      connection.destroy()
      connection.unref()
    })
    splinky._close(callback)
  }
}

module.exports = server
module.exports.port = PORT