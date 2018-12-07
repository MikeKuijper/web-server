const server = require('../server.js');

module.exports.run = async (args) => {
  if (args[1] == "true") {
    server.maintenance = true;
    server.logAction("Switched to Maintenance Mode");
    return;
  } else if (args[1] == "false") {
    server.maintenance = false;
    server.logAction("Switched to Normal Mode");
    return;
  } else {
    server.logCustomYellow("That state was not found, it should either be 'true' or 'false'", "ERROR");
    return;
  }
}

module.exports.help = {
  name: 'maintenance'
}
