var connect = require("./connect.js");
var handler = require("./handler.js");
var util = require("./util.js");

/* output debugger for signaling server */
util.log("[SERVER] STARTING SIGNALLING SERVER", 'green');
util.log("[HANDLER] HANDLERS LOADED", 'green');

/* socket connections */
connect.io.on('connection', function(socket){
	
	/**
	 * connect to room
	 * @param data -> configuration of conecting peer
	 */
	socket.on('common.connectToRoom', function(data, callback){
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
					handler.teacher.registerTeacher({
						data: data, 
						teachers: connect.teachers
					}, resolve, reject);
					break;
				
				// register the student to the student's room
				case 'student':
					handler.student.registerStudent({
						data: data,
						students: connect.students
					}, resolve, reject);
					break;
					
				case 'admin':
					break;
					
				default:
			}
		})
		
		// when the 'try' phase was successful
		.then(function(content){
			// clean any empty values
			connect.teachers = util.compact(connect.teachers);
			connect.users = util.compact(connect.users);
			
			// set socket information
			socket.userData = data;
			
			// join socket room
			socket.join(data.chatHash);

			// inform peers in the room
			socket.broadcast.to(data.chatHash).emit("room.generalCommand", {command:"roomConnected", content: data});
		})
		
		// catch any errors that may occur during the 'try' phase
		.catch(function(errors){
			util.logError(errors);
			obj.error = true;
			obj.content = errors;
		})
		
		// always trigger this function
		.then(function(){
			return callback(obj);
		});
	});
	
	/**
	 * @data: object
	 * @data.command: type of command to be executed
	 * @data.content: content of command, will depend on the command source
	 * @callback: execute callback 
	 */
	socket.on('room.generalCommand', function(data, callback){
		// default parse
		var obj = {error: false, content: ''};
		
		// check if the data variable contains 
		// valid values
		if (typeof data.command === undefined || typeof data.content === undefined) {
			obj.error = true;
			obj.content = "reason_invalid_room_command";
			return callback(obj);
		}
		
		// set vars
		var command = data.command;
		var content = data.content;
		var mode = (typeof data.mode === 'undefined') ? 'all' : data.mode;
		
		// try executing general command
		util.try(function(resolve, reject){
			// identify the command
			switch (command) {
				case 'teacherLessonDisconnect':
					handler.teacher.disconnectTeacher({
						data: content, 
						teachers: connect.teachers
					}, resolve, reject);
					break;
				default:
					resolve();
			}
		})
		
		// when the 'try' phase was successful
		.then(function(){
			// if broadcast to all, excluding sender
			if (mode == 'to') {
				socket.broadcast.to(content.chatHash).emit('room.generalCommand', data);
			// if broadcast to room, including sender
			} else {
				connect.io.in(content.chatHash).emit('room.generalCommand', data);
			}
		})
		
		// catch any errors that may occur during the 'try' phase
		.catch(function(errors){ 
			util.logError(errors); 
			obj.error = true;
			obj.content = errors;
		})
		
		// always trigger this function
		.then(function(){
			return callback(obj);
		});
	});
	
	/* catch disconnection module */
	socket.on('disconnect', function(action){
		util.logError("socket -> " + socket.id + " action -> " + action);
		util.logError(JSON.stringify(socket.userData));
		
		// try executing the disconnection logic
		util.try(function(resolve, reject){
			// set the userData
			var userData = socket.userData;
			
			// get the member type
			var memberType = (typeof userData.memberType === 'undefined') ? 'unkown' : userData.memberType; 
			
			// send disconnection notice to peers
			connect.io.in(userData.chatHash).emit('room.generalCommand', {command: "lessonDisconnect", content: userData});
			resolve();
		})
		
		// when the 'try' phase was successful
		.then(function(){})
		
		// catch any errors that may occur during the 'try' phase
		.catch(function(errors){
			util.logError(errors);
		})
		
		// always trigger this function
		.then(function(){
			socket.leave();
		});
	});
});