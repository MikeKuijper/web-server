const server = require('../server.js');

module.exports.run = async (args) => {
  server.logAction("Shutting down...");
  server.shutDown();
}

module.exports.help = {
  name: 'shutdown'
}
