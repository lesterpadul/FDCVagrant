/* set dependencies */
var fs         = require("fs");
var express    = require("express"); // routing
var crypto     = require('crypto'); // encryption
var moment     = require("moment"); // time manipulation
var _          = require("underscore"); // array handling
var app        = express(); // server

/* load external javascript libraries */
var constants  = require('./constant.js');
var util  = require('./util.js');
var model = require('./model.js');
var ssl = require('./ssl.js');
var logger = require('./logger.js');
var db = require('./database.js');

/* set socket configuration */
var socketConfig = {
	'origins': ssl.origins, 
	'pingTimeout': 40000, 
	'pingInterval': 10000
};

/* set server functions */
var server     = require('https').createServer(ssl.options, app);
var io         = require("socket.io").listen(server, socketConfig);
var socket     = io.sockets;
var peer       = require("peer").ExpressPeerServer;

/* set app engine */
app.use('/peerjs', peer(server, {debug: true}));

/* listen to default port 0.0.0.0 */
var server = server.listen(ssl.port, "0.0.0.0", function(){ 
	util.log("[SOCKET] listening to port " + ssl.port, 'green'); 
	logger.dbInit(db);
	logger.create('NJSNS1', 'socket');
});

/* export */
exports.io = io; // socket.io object
exports.teachers = []; // teachers array
exports.students = []; // students array
exports.admins = {}; // admins array
exports.connectAdminIps = {};
exports.selected_ip = null;
exports._ = _; // underscore object
exports.util = util; // common util library
exports.constants = constants; // constants

/* chatrooms */
exports.chatRooms = {};