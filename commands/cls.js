const server = require('../server.js');
const colors = require('colors');
const ip = require('ip');

module.exports.run = async (args) => {
  console.clear();
  console.log("===========================================================\n" +
    " __  __ _ _        _        _____                          \n".cyan +
    "|  \\/  (_) |      ( )      / ____|                         \n".cyan +
    "| \\  / |_| | _____|/ ___  | (___   ___ _ ____   _____ _ __ \n".cyan +
    "| |\\/| | | |/ / _ \\ / __|  \\___ \\ / _ \\ '__\\ \\ / / _ \\ '__|\n".cyan +
    "| |  | | |   <  __/ \\__ \\  ____) |  __/ |   \\ V /  __/ |   \n".cyan +
    "|_|  |_|_|_|\\_\\___| |___/ |_____/ \\___|_|    \\_/ \\___|_|   \n".cyan +
    "===========================================================");
  console.log("[SERVER]  SERVER IS LIVE ON ADDRESS: ".green + ip.address() + ":" + server.port);
  console.log("===========================================================");
  return;
}

module.exports.help = {
  name: 'cls'
}
