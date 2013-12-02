const engine = require('engine.io')

module.exports = function (splinky) {
  splinky.reg(module.exports.startup)
  splinky.reg(module.exports.shutdown)
}

module.exports.startup = startup
module.exports.startup.$config = {
    id      : '00-startup-splinky-ws'
  , category: 'startup'
  , depends : [ 'splink' ]
}

module.exports.shutdown = shutdown
module.exports.shutdown.$config = {
    id      : 'shutdown-splinky-ws'
  , category: 'shutdown'
  , depends : [ 'splink' ]
}

function initWs (httpServer, key) {
  var meta    = this.splink.meta(key)
    , path    = meta.path
    , options = meta.wsOptions || {}

  if (typeof path == 'string')
    options.path = path

  this.splink.byId(key, function (err, ws) {
    if (err)
      return console.error('Error loading "ws" component:', key, err)
    if (typeof ws != 'function')
      return console.error('"ws" component is not a function:', key)

    var server = engine.attach(httpServer, options)
    this.wsServers.push(server)
    ws(server)
  }.bind(this))
}

function startup (httpServer) {
  var wsServers = this.wsServers = []
  console.log('wsServers')
  this.splink.reg(wsServers, '_wsServers')
  this.splink.keysByCategory('ws').forEach(initWs.bind(this, httpServer))
}

function shutdown (httpServer) {
  var wsServers = this.splink.byId('_wsServers')
  process.nextTick(function () {
  wsServers.forEach(function (server) {
    server.ws.close()
    server.close()
  })
}, 1000)
}