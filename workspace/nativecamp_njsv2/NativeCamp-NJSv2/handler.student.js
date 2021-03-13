/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js');
var db = require('./database.js');
var model = require('./model.js');
var connect = require('./connect.js');
var logger = require('./logger.js');

/* export student functions */
module.exports = {
	registerStudent: function(obj, resolve, reject, socket){	
		// check if the students array or data from student exists
		if (typeof obj.data === undefined) {
			return reject("reason_invalid_student_params_" + data.chatHash);
		}
		
		// set vars
		var data = obj.data;

		// if room does not exist, then create room
		if (typeof connect.chatRooms[data.chatHash] === 'undefined') { 
			return reject("reason_no_room_" + data.chatHash);
		}
		
		// try student start
		util.try(function(tryRes, tryRej){
			// search conditions
			var searchConditions = {};

			// check if has recruit id
			if (data.memberType == 'admin_recruiter') {
				searchConditions = {chat_hash: data.chatHash, admin_id: data.userID}

			// check if has student id
			} else {
				searchConditions = {chat_hash: data.chatHash, user_id: data.userID}
			}

			// check if has lessonOnair
			model.hasLessonOnair(searchConditions, data)
			
			// if has lessonOnair
			.then(function(onairs){
				// check if has any onairs data
				if (!onairs) { 
					util.log("[ROOM_SOCKET] student has no onairs -> " + data.chatHash);
					return tryRej("reason_no_lesson_onairs_" + data.chatHash); 
				}
				
				// check if a student is already in the room
				if (
					typeof connect.chatRooms[data.chatHash].user !== 'undefined' && 
					connect.chatRooms[data.chatHash].user !== null &&
					typeof connect.io.sockets.adapter.rooms[data.chatHash] !== 'undefined'
				) {
					// get the room's occupants
					var roomClients = connect.io.sockets.adapter.rooms[data.chatHash]; 
					var duplicateSocket = null;

					// loop through the existing room connections
					for (var clientId in roomClients.sockets) {
						try {
							// disallow 'reconnection'
							if (clientId === socket.id) { continue; }

							// get the client's socket
							var clientSocket = connect.io.sockets.sockets[clientId];

							// if the client's userData is undefined, ignore
							if (typeof clientSocket.userData === 'undefined') { continue; }

							// if teacher, ignore
							if (
								typeof clientSocket.userData.memberType === 'undefined' ||
								(
									typeof clientSocket.userData.memberType !== 'undefined' &&
									clientSocket.userData.memberType !== data.memberType
								)
							) { continue; }

							// disconnect student
							duplicateSocket = clientSocket;
							clientSocket.forceDisconnect = true;
							socket.broadcast.to(clientId).emit('room.generalCommand', {command: constant.disconnect.student.forceReconnect, content: data});

							// override socket connection
							util.log("[ROOM_SOCKET] student overriding previous connections -> " + data.chatHash);

							// disconnect previous student session
							clientSocket.disconnect();
						} catch (ex) { continue; }
					}
				}

				// check if teacher disconnect timeout has already been set
				if (
					typeof connect.chatRooms[data.chatHash].studentDisconnect !== 'undefined' && 
					connect.chatRooms[data.chatHash].studentDisconnect !== false
				) {
					clearTimeout(connect.chatRooms[data.chatHash].studentDisconnect);
					util.log('[STUDENT] cleared timeout for student disconnection', 'green');
				}

				// insert student in the room
				connect.chatRooms[data.chatHash].user = data.userID;
				connect.chatRooms[data.chatHash].studentDisconnect = false;
				util.log('[STUDENT] inserting user to the room -> ' + data.chatHash, 'green');

				// add created date
				if (
					typeof connect.chatRooms[data.chatHash].start === 'undefined' || 
					connect.chatRooms[data.chatHash].start === ''
				) {
					util.log('[STUDENT] inserted start date -> ' + data.chatHash, 'green');
					connect.chatRooms[data.chatHash].start = util.getCurrentTime();
				}
				
				// resolve connection
				return tryRes();
			})
			
			// catch any errors that may occur during searching
			.catch(function(errors){ return tryRej(errors); });
		})
		.then(function(){ return resolve(); })
		.catch(function(errors){ return reject(errors); });
	},
	
	/**
	 * disconnect the student and end the lesson
	 * @param obj -> will contain the teacher's information,
	 * @param resolve -> execute if the process was successful
	 * @param reject -> execute if the process failed
	 */
	disconnectStudent: function(obj, resolve, reject){
		// check if the teachers array or data from teacher exists
		if (typeof obj.data === undefined) {
			return reject("reason_invalid_student_params");
		}
		
		// get data
		var data = obj.data;
		
		// set student disconnection to true
		if (connect.chatRooms[data.chatHash] !== 'undefined') {
			util.log('[STUDENT_DISCONNECTION] disconnecting student -> ' + data.chatHash);
			clearTimeout(connect.chatRooms[data.chatHash].studentDisconnect);
			connect.chatRooms[data.chatHash].studentDisconnect = true;
		}
		
		// clear the lesson
		model.clearLesson({chat_hash: data.chatHash}, data, obj.lessonFinish)
		.then(function(){
			// delete room
			model.deleteRoom(data.chatHash);
			
			// resolve
			return resolve();
		})
		.catch(function(errors){ return reject(errors); });
	},
	
	/**
	 * disconnect the user and remove him/her from the room
	 * @param obj -> will contain the student's information
	 */
	studentLeaveRoom: function(obj, socket, disconnection){
		/* check if the teachers array or data from teacher exists */
		if (typeof obj.data === undefined) {
			logger.create('NJSEG2', '', obj);
			return reject("reason_invalid_teacher_params");
		}
		
		/* set vars */
		var data = obj.data;
		var element = this;

		/* check if teacher disconnect timer has already been set */
		if (
			typeof connect.chatRooms[data.chatHash] !== 'undefined' && 
			typeof connect.chatRooms[data.chatHash].studentDisconnect !== 'undefined' && 
			connect.chatRooms[data.chatHash].studentDisconnect === false
		) {
			/* set room disconnection */
			util.log('[STUDENT_LEAVE_ROOM] setting timeout for student disconnection -> ' + data.chatHash);
			
			/* declare timeout disconnection */
			connect.chatRooms[data.chatHash].studentDisconnect = setTimeout(function(){
				/* check if chat hash still exists */
				if (typeof connect.chatRooms[data.chatHash] === 'undefined') { 
					util.log('[STUDENT_LEAVE_ROOM] unable to execute student timeout, room is already deleted ' + data.chatHash);
					return false; 
				}
				
				/* log message */
				util.log('[STUDENT_LEAVE_ROOM] executing student disconnection -> ' + data.chatHash);
				
				try {
					/* emit */
					return socket.in(data.chatHash).emit('room.generalCommand', {command: constant.disconnect.student.timeOut, content: data});
				} catch (e) { util.logError(" [STUDENT_TIMEOUT_DISCONNECTION] " + JSON.stringify(error));  }
			}, 50000);
		}
	}
};