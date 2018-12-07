const server = require('../server.js');

module.exports.run = async (args) => {
  server.logInfo(server.connections.length);
}

module.exports.help = {
  name: 'cnn'
}
