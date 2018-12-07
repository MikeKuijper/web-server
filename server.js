//Importing necessary libraries
const express = require('express');
const app = express();
const colors = require('colors');
const ip = require('ip');
const fs = require('fs');
const subdirs = require('subdirs');

const port = 4000;

//Logging the start of the server
console.clear();
console.log("===========================================================\n" +
  " __  __ _ _        _        _____                          \n".cyan +
  "|  \\/  (_) |      ( )      / ____|                         \n".cyan +
  "| \\  / |_| | _____|/ ___  | (___   ___ _ ____   _____ _ __ \n".cyan +
  "| |\\/| | | |/ / _ \\ / __|  \\___ \\ / _ \\ '__\\ \\ / / _ \\ '__|\n".cyan +
  "| |  | | |   <  __/ \\__ \\  ____) |  __/ |   \\ V /  __/ |   \n".cyan +
  "|_|  |_|_|_|\\_\\___| |___/ |_____/ \\___|_|    \\_/ \\___|_|   \n".cyan +
  "===========================================================");
console.log("[SERVER]  STARTING SERVER...".green);

let commands = [];
fs.readdir("./commands/", (err, files) => {
  console.log("[SERVER]  LOADING COMMANDS...".green);

  if (err) console.log(error);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    throw ("Couldn't find commands");
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`[SERVER]  + `.green + f + ` was loaded`.green);
    commands.push({
      "name": props.help.name,
      "props": props
    })
    //bot.commands.set(props.help.name, props);
  });
});

//Making sure we can use the files in the 'public' library for hosting
app.use(express.static('public'));
subdirs("public", function(err, dirs) {
  for (i in dirs) {
    let path = dirs[i].replace(/\\/g, "/");
    app.use(express.static(path));
  }
  console.log("[SERVER]  IMPORTED ".green + i + " DIRECTORIES".green);
  console.log("===========================================================");
});

//Allowing and handling user input
let input = process.openStdin();
input.addListener("data", function(d) {
  let args = d.toString().trim().split(' ');
  let command = args[0];

  let commandFile = commands.find((element, index, array) => {
    if (element.name == args[0]) {
      element.props.run(args);
      return element.props;
    }
  });
  if (!commandFile) logCustomYellow("Couldn't recognise that command...", "ERROR");
});
console.log("[SERVER]  INITIALIZED INPUT".green);

//Making a new server on set port, and handling the EADDRINUSE error
let server = app.listen(port, () => {
  console.log("[SERVER]  SERVER STARTED ON ADDRESS: ".green + ip.address() + ":" + port);
  //console.log("===========================================================");
}).on('error', (error) => {
  let e = error.message.slice(error.message.indexOf(" "), error.message.lastIndexOf(" ")).trim();
  switch (e) {
    case 'EADDRINUSE':
      console.log("[ERROR]   IP ADDRESS IN USE".red);
      process.exit(0);
      break;
    default:
      console.log("[ERROR]   ".red + e.red);
      process.exit(0);
      break;
  }
});

let bool;
let maintenance = false;
let isBlocked = false;

console.log("[SERVER]  IMPORTING PAGE FILE...".green);
try {
  let pages = JSON.parse(fs.readFileSync('./pages.json'));
} catch (e) {
  console.log("[ERROR]   COULD NOT LOAD THE PAGE FILE".red);
  process.exit(0);
}

app.use((request, response, next) => {
  console.log(maintenance);
  if (!maintenance) {
    blocked = JSON.parse(fs.readFileSync('./blocked.json'));
    let isBlocked = false;
    let ipAddress = request.ip;
    //if (ip.isEqual(request.ip, "::1") || ip.isEqual(request.ip, "::ffff:127.0.0.1") || ip.isEqual(request.ip, ip.address())) ipAddress = 'localhost';
    //else ipAddress = request.ip;

    for (index in blocked.blocked) {
      if (ip.isEqual(request.ip, blocked.blocked[index])) {
        response.sendFile(__dirname + '/public/blocked/main.html');
        logCustomYellow(request.originalUrl, request.method, ipAddress);
        logAction("Blocked", ipAddress)
        isBlocked = true;
        break;
      }
    }
    if (!isBlocked) {
      for (i in pages.pages) {
        bool = false;
        if (request.originalUrl == pages.pages[i].url || request.originalUrl == pages.pages[i].url + "/") {
          logCustomWhite(request.originalUrl, request.method, ipAddress);
          response.sendFile(__dirname + '/public/' + pages.pages[i].path + '/main.html');
          bool = true;
          break;
        }
      }
      if (!bool) {
        let ipAddress = request.ip;
        //if (ip.isEqual(request.ip, "::1")) ipAddress = 'localhost';
        //else ipAddress = request.ip;
        logCustomYellow(request.originalUrl, request.method, ipAddress);
        //logAction("Redirected to main page", ipAddress);
        //response.status(404).redirect('/');
        logAction("Responded with 404", ipAddress);
        response.status(404).sendFile(__dirname + '/public/404/main.html')
      }
    }
  } else {
    logCustomWhite(request.originalUrl, request.method, request.ip);
    response.sendFile(__dirname + "/public/maintenance/main.html");
    logAction("Responded with maintenance page", request.ip);
  }
});
console.log("[SERVER]  INITIALIZED REQUEST HANDLER".green);

//Defining a function for smooth shutdown
let connections = [];

function shutDown() {
  server.close(() => {
    logCustomWhite('Closed out remaining connections', "SERVER");
    process.exit(0);
  });
  setTimeout(() => {
    logCustomWhite('Could not close connections in time, forcefully shutting down', "SERVER");
    //console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);

  connections.forEach(curr => curr.end());
  setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}

//On a new connection => add the details to the 'connections' array
server.on('connection', connection => {
  connections.push(connection);
  connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

process.on('SIGINT', function() {
  logAction("Shutting down...");
  shutDown();
});

//Adding a bunch of log functions
function logGetYellow(text, ip) {
  console.log("[GET]     ".yellow + "(" + ip + ")    " + text.yellow);
}

function logGetWhite(text, ip) {
  console.log("[GET]     (" + ip + ")    " + text);
}

function logGetRed(text, ip) {
  console.log("[GET]     ".red + "(" + ip + ")    " + text.red);
}

function logAction(text, ip) {
  if (ip) console.log("[ACTION] ".cyan + "(" + ip + ")    " + text.cyan);
  else console.log("[ACTION]    ".cyan + text.cyan);
}

function logInfo(text, ip) {
  if (ip) console.log("[INFO]    (" + ip + ")    " + text);
  else console.log("[INFO]    " + text);
}

function logCustomWhite(text, string, _ip) {
  if (_ip) console.log("[" + string + "]    (" + _ip + ")    " + text);
  else console.log("[" + string + "]    " + text);
}

function logCustomYellow(text, string, _ip) {
  if (_ip) console.log("[".yellow + string.yellow + "]    ".yellow + "(" + _ip + ")    " + text.yellow);
  else console.log("[".yellow + string.yellow + "]    ".yellow + text.yellow);
}

module.exports = {
  "logGetYellow": logGetYellow,
  "logGetWhite": logGetWhite,
  "logGetRed": logGetRed,
  "logAction": logAction,
  "logInfo": logInfo,
  "logCustomWhite": logCustomWhite,
  "logCustomYellow": logCustomYellow,
  "connections": connections,
  "port": port,
  "server": server,
  "shutDown": shutDown,
  "maintenance": maintenance
}
