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

/* set server functions */
var server     = require('https').createServer(constants.ssl, app);
var io         = require("socket.io").listen(server);
var socket     = io.sockets;
var peer       = require("peer").ExpressPeerServer;

/* set app engine */
app.use('/peerjs', peer(server, {debug: true}));

/* listen to default port 0.0.0.0 */
var server = server.listen(constants.port, "0.0.0.0", function(){ 
	util.log("[SOCKET] listening to port " + constants.port, 'green'); 
});

/* export */
exports.io = io; // socket.io object
exports.peer = peer; // peer server
exports.teachers = []; // teachers array
exports.students = []; // students array
exports.admins = []; // admins array
exports._ = _; // underscore object
exports.util = util; // common util library
exports.constants = constants; // constants

/* chatrooms */
exports.chatRooms = [{
	room: '', 
	user: {}, 
	teacher: {},
	admins: []
}];