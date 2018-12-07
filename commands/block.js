const Address6 = require('ip-address').Address6;
const ip = require('ip');
const fs = require('fs');
const server = require('../server.js');

let blocked = JSON.parse(fs.readFileSync('./blocked.json'));

module.exports.run = async (args) => {
  let allowed = true;
  let IP = new Address6(args[1]);
  if (!IP.isValid()) {
    server.logCustomYellow("That is not a valid IP-address", "ERROR");
    return;
  }
  for (i in blocked.blocked) {
    if (ip.isEqual(blocked.blocked[i], args[1])) {
      server.logCustomYellow("That IP-address is already blocked", "ERROR");
      allowed = false;
      break;
    }
  }
  if (allowed) {
    blocked.blocked.push(args[1]);
    fs.writeFileSync("./blocked.json", JSON.stringify(blocked));
    server.logAction("Successfully added to the block list", args[1]);
  }
}

module.exports.help = {
  name: 'block'
}
