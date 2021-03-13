var connect = require("./connect.js");
var handler = require("./handler.js");
var util = require("./util.js");
var moment = require("moment");
var ut = require('util');
var constant = require('./constant.js');
var logger = require('./logger.js');

/* output debugger for signaling server */
util.log("[SERVER] STARTING SIGNALLING SERVER", 'green');
util.log("[HANDLER] HANDLERS LOADED", 'green');

/* chatroom cleaner */
setInterval(function(){
	/* catch any errors that may occur during garbage collection */
	try {
		util.log("/* CLEANING GARBAGE */");
		if (global.gc){ global.gc(); }
		else { util.log("/* GARBAGE COLLECTION IS NOT AVAILABLE */"); }
	} catch (e) { util.logError(e); }
	
	/* check if have rooms to clean */
	if (util.getRoomLength(connect.chatRooms) <= 0) { 
		util.log("/* NO ROOMS TO CLEAN! */");
		return; 
	}
	
	/* start logger */
	util.log("/* CLEANING ROOMS */", 'green');
	
	/* try clearing the rooms */
	try {
		for (var room in connect.chatRooms) {
			if (typeof connect.chatRooms[room] === 'undefined') { return; }
			room = connect.chatRooms[room];
			
			/* check if created is undefined */
			if (typeof room.created === 'undefined') { return; }
			if (room.created === '') { return; }
			
			/* get created data */
			var endTime = util.getCurrentTime();
			var createdTime = moment(room.created);
			var createdDateDiff = Math.floor(moment(endTime).diff(createdTime)) / 1000;
			
			/* if more than 1 day since creation */
			if (createdDateDiff > 86400) {
				util.log("[CHATROOMS] deleted room that existed for more than 1 day -> " + JSON.stringify(room.room), 'red', 'white');
				handler.common.deleteRoom(room.room);
				return;
			}
			
			/* check if start is empty */
			if (typeof room.start === 'undefined') { return; }
			if (room.start === '') { return; }
			
			/* get lesson time bounderies */
			var startTime = moment(room.start);
			var dateDiff = Math.floor(moment(endTime).diff(startTime)) / 1000;
			
			/* if more than 1 hour since lesson start */
			if (dateDiff > 3600) {
				util.log("[CHATROOMS] deleted room that had lesson for more than 30 minutes -> " + JSON.stringify(room.room), 'red', 'white');
				handler.common.deleteRoom(room.room);
				return;
			}
		}
	} catch (e) { util.logError(e); }
	
	/* end logger */
	util.log("/* END OF CLEANING ROOMS */", 'green');
}, 60000 * 60);

/* socket connections */
connect.io.on('connection', function(socket){
	/**
	 * connect to room
	 * @param data -> configuration of conecting peer
	 */
	socket.on('common.connectToRoom', function(data){
		// default parse
		var obj = {error: false, content: ''};

		// create new promise
		util.try(function(resolve, reject){
			// check if chathash is undefined
			if (typeof data.chatHash === 'undefined') {
				obj.content = "reason_unknown_chat_hash";
				obj.error = true;
				return reject(obj);
			}
			
			// if member type is not valid
			if (typeof data.memberType === 'undefined') {
				obj.content = "reason_unknown_member_type";
				obj.error = true;
				return reject(obj);
			}

			// identify memberType
			switch (data.memberType) {
				// register the teacher to the teacher's room
				case 'teacher':
				case 'recruit_camera_check':
					handler.teacher.registerTeacher({
						data: data
					}, resolve, reject, socket);
					break;

				// register the student to the student's room
				case 'student':
				case 'admin_recruiter':
					handler.student.registerStudent({
						data: data
					}, resolve, reject, socket);
					break;

				// register student test
				case 'student-test':
					resolve();
					break;

				// register admin user
				case 'admin':
					handler.admin.registerAdmin({
						data: data
					}, reject, socket);
					break;

				default:
			}
		})

		// when the 'try' phase was successful
		.then(function(content){
			obj.error = false;
			obj.content = socket.id;
			
			// set socket information
			socket.userData = data;

			// join socket room
			socket.join(data.chatHash);

			// inform peers in the room
			socket.broadcast.to(data.chatHash).emit("room.generalCommand",
				{
					command: "roomConnected",
					content: data
				}
			);
		})

		// catch any errors that may occur during the 'try' phase
		.catch(function(errors){
			util.logError(" [ROOM_CONNECTION] " + JSON.stringify(errors));
			obj.error = true;
			obj.content = errors;
		})
	
		// always trigger this function
		.then(function(){ return socket.emit('common.connectedToRoom', obj); });
	});

	/**
	 * @data: object
	 * @data.command: type of command to be executed
	 * @data.content: content of command, will depend on the command source
	 * @callback: execute callback
	 */
	socket.on('room.generalCommand', function(data){
		// default parse
		var obj = {error: false, content: ''};
		
		// check if the data variable contains
		// valid values
		if (typeof data.command === undefined || typeof data.content === undefined) {
			obj.error = true;
			obj.content = "reason_invalid_room_command";
			return socket.emit('room.generalCommandSent', obj);
		}
		
		// set vars
		var command = data.command;
		var content = data.content;
		var mode = (typeof data.mode === 'undefined') ? 'all' : data.mode;
		var lessonFinish = 0;
		
		// log socket
		if (command !== "HEARTBEAT") { util.log("[SOCKET] " + JSON.stringify(data), "blue"); }
		
		// try executing general command
		util.try(function(resolve, reject){
			// identify the command
			switch (command) {
				/* teacher lesson disconnection */
				case 'lessonDisconnect':
				case 'teacherTimedOut':
				case 'teacherLessonDisconnectOthers':
				
				/* student lesson disconnection */
				case 'studentLessonDisconnect':
				case 'studentTimedOut':
				case 'studentLessonDisconnectOthersAction':
					if (command == 'lessonDisconnect') { lessonFinish = 1; }
					if (command == 'teacherLessonDisconnectOthers') { lessonFinish = 2; }
					if (command == 'teacherTimedOut') { lessonFinish = 3; }
					if (command == 'studentTimedOut') { lessonFinish = 5; }
					if (command == 'studentLessonDisconnectOthersAction') { lessonFinish = 4; }
					
					// finish lesson
					handler.teacher.disconnectTeacher({
						data: content,
						lessonFinish: lessonFinish
					}, resolve, reject);
					break;
				
				/* send chat */
				case 'sendChat':
					handler.common.sendChat({
						data:content,
						mode: 'to'
					},resolve);
					break;
				case 'registerStudentTest':
					handler.student.AddStudentTestLog({
						data: data.content
					},resolve, reject);
					break;
				case 'selectIp':
					connect.selected_ip = content.ip;
					resolve(connect.selected_ip);
					break;
				/* automatically resolve by default */
				default:
					resolve();
			}
		})

		// when the 'try' phase was successful
		.then(function(response){
			// if broadcast to all, excluding sender
			if (mode == 'to') {
				socket.broadcast.to(content.chatHash).emit('room.generalCommand', data);
			
			// if broadcast to room, including sender
			} else {
				connect.io.in(content.chatHash).emit('room.generalCommand', data);
			
			}
			
			// set content
			obj.command = command;
			obj.error = false;
			obj.content = data;
		})

		// catch any errors that may occur during the 'try' phase
		.catch(function(errors){
			util.logError(" [GENERAL_COMMAND] " + errors);
			obj.error = true;
			obj.content = errors;
			logger.create("NJSEG12", content.chatHash, {data: content, errors: errors});
		})

		// always trigger this function
		.then(function(){
			obj = ({
				command: command,
				content: data.content,
				error: obj.error
			});
			return socket.emit('room.generalCommandSent', obj);
		});
	});

	/**
	 * check if user exists
	 * @param: obj
	 * @param: obj.userType -> teacher | student
	 * @param: obj.userID -> teacher or student's user ID
	 */
	socket.on('room.userHasClass', function(data){
		util.log("[ROOM_CHECKER] checking user's existence -> " + JSON.stringify(data));
		var obj = {error: false, content: ''};

		// check if user exists
		util.try(function(resolve, reject){
			var userIndex = -1;
			
			// check if returned proper parameters
			if (typeof data.memberType === 'undefined' || typeof data.userID === 'undefined') {
				return reject("reason_invalid_parameters");
			}

			// set the userID
			data.userID = String(data.userID);

			// if userType is teacher
			if (data.memberType == "teacher") {
				userIndex = util.getIndex(connect.chatRooms, {teacher:data.userID});
			}

			// if userType is student
			if (data.memberType == "student") {
				userIndex = util.getIndex(connect.chatRooms, {user:data.userID});
			}

			// return the user's index
			util.log("[ROOM_CHECKER] user index -> " + userIndex);
			
			// return resolve
			return resolve(userIndex);
		})

		// if everything was successful
		.then(function(userIndex){
			obj.error = false;
			obj.content = ((userIndex < 0) ? 'has_no_classes' : 'has_classes');
		})

		// catch any errors that may occur during checking
		.catch(function(errors){
			util.logError(errors);
			obj.error = true;
			obj.content = errors;
		})

		// run after the checking process
		.then(function(){
			return socket.emit('room.userHasClass', obj);
		});
	});
	
	/**
	 * reset room occupants
	 * @param: obj
	 * @param: obj.room -> chatHash
	 * @param: obj.teacherID -> teacher's ID
	 */
	socket.on('room.clearClassOccupants', function(data){
		data.room = String(data.room);
		var obj = {error: false, content: ''};
		
		// check if user exists
		util.try(function(resolve, reject){
			var userIndex = -1;
			
			// return resolve
			return resolve(userIndex);
		})

		// if everything was successful
		.then(function(userIndex){
			obj.error = false;
			obj.content = "room_reset";
		})

		// catch any errors that may occur during checking
		.catch(function(errors){
			obj.error = true;
			obj.content = errors;
		})

		// run after the checking process
		.then(function(){
			// send general command
			connect.io.in(data.room).emit('room.generalCommand', {command: constant.disconnect.teacher.forceReconnect});
			
			// callback
			return socket.emit('room.clearClassOccupants', obj);
		});
	});

	/* catch disconnection module */
	socket.on('disconnect', function(action){
		util.log("[DISCONNECTION] " + socket.id + " action -> " + action, "red");
		util.log(JSON.stringify(socket.userData), "red");
		
		// set vars
		var command = "lessonDisconnect";
		var userData = typeof socket.userData !== 'undefined' ? socket.userData : null;
		
		// trigger leave and trigger disconnection
		if (
			userData !== null &&
			typeof userData.chatHash !== 'undefined'
		) { socket.leave(userData.chatHash); }
		
		// if user data has no content return false;
		if (!userData) {
			return false;
		}
		
		// try executing the disconnection logic
		util.try(function(resolve, reject){
			// get the member type
			var memberType = (typeof userData.memberType === 'undefined') ? 'unknown' : userData.memberType;
			var command = "lessonDisconnect";

			// switch through members
			switch (memberType) {
				// if student users
				case 'student':
				case 'admin_recruiter':
					command = constant.disconnect.student.sudden;
					handler.student.studentLeaveRoom({
						data: userData
					}, connect.io, action);
					break;

				// if teacher user
				case 'recruit_camera_check':
				case 'teacher':
					command = constant.disconnect.teacher.sudden;
					handler.teacher.teacherLeaveRoom({
						data: userData
					}, connect.io, action);
					break;

				// if admin
				case 'admin':
					handler.admin.disconnectAdmin({
						data: userData
					}, socket, reject);
					break;

				// default
				default:
					command = "testDeviceSuddenDisconnect";
			}

			// send sudden user disconnection emit
			if (action !== "client namespace disconnect" && action !== "server namespace disconnect") {
				logger.create('NJSND5', userData.chatHash, {data: userData, action: action, command: command}); 
				connect.io.in(userData.chatHash).emit('room.generalCommand', {command: command, content: userData});
			}
			
			// resolve function
			return resolve(command);
		})

		// when the 'try' phase was successful
		.then(function(command){})
		
		// catch any errors that may occur during the 'try' phase
		.catch(function(errors){
			util.logError(" [DISCONNECTION] " + errors);
			logger.create('NJSED3', userData.chatHash, {data: userData, errors: errors});
		})
		
		// always trigger this function
		.then(function(){});
	});
});
