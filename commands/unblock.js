const server = require('../server.js');

module.exports.run = async (args) => {
  let found;
  if (args[1] == "all") {
    blocked.blocked.splice(0);
    fs.writeFileSync("./blocked.json", JSON.stringify(blocked));
    logAction("Successfully cleared the block list");
    return;
  }
  for (i in blocked.blocked) {
    if (blocked.blocked[i] == args[1]) {
      found = true;
      break;
    } else if (i == blocked.blocked.length && blocked.blocked[i] != args[1]) found = false;
  }
  if (found) {
    blocked.blocked.splice(i, 1);
    fs.writeFileSync("./blocked.json", JSON.stringify(blocked));
    server.logAction("Successfully removed from the block list", args[1]);
  } else {
    server.logCustomYellow("Didn't find that IP-address", "ERROR");
  }
}

module.exports.help = {
  name: 'unblock'
}
