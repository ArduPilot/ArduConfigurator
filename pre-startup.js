//node.js node-main script file, executed on startup in Node context aka "background page" before the first DOM window load.

console.log("pre-startup.js")

$a = 1;

var {SmartSerialLink,SmartUDPInLink,SmartUDPOutLink,SmartTCPLink,mpo} = require("./smartlinks.js");


mpo.add_link('tcp:localhost:5762'); // to/from sitl
