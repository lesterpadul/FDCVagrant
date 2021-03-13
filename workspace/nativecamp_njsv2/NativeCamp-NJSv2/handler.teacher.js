/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js');
var model = require('./model.js');
var connect = require('./connect.js');
var logger = require('./logger.js');

/* export student functions */
module.exports = {
	/**
	 * registers teacher in the teachers array
	 * @param obj -> will contain the teacher's information,
 	 * @param resolve -> execute if the process was successful
 	 * @param reject -> execute if the process failed
	 */
	registerTeacher: function(obj, resolve, reject, socket){
		// check if the teachers array or data from teacher exists
		if (typeof obj.teachers === undefined || typeof obj.data === undefined) {
			return reject("reason_invalid_teacher_params");
		}	
		
		// get data
		var data = obj.data;
		var chatHash = data.chatHash;
		
		// start teacher registration logic
		util
		
		// check if a room exists
		.try(function(res, rej){
			// if no room exists
			if (typeof connect.chatRooms[data.chatHash] === 'undefined') {
				util.log('[TEACHER_CONNECT] adding new room for -> ' + data.chatHash);
				connect.chatRooms[chatHash] = {
					room: data.chatHash,								// room name
					created: util.getCurrentTime(), 		// when the room was created
					start: '',													// when the lesson will start or was started
					user: null, 												// student's ID
					teacher: data.teacherID,						// teacher's ID
					teacherDisconnect: false, 					// timer for teacher disconnection
					studentDisconnect: false						// timer for student disconnection
				};
				
			// room already exists
			} else { 
				util.log('[TEACHER_CONNECT] room already exists for -> ' + data.chatHash);
			}
			
			// check if a teacher is already in the room
			if (
				typeof connect.chatRooms[data.chatHash].teacher !== 'undefined' && 
				connect.chatRooms[data.chatHash].teacher !== null &&
				typeof connect.io.sockets.adapter.rooms[data.chatHash] !== 'undefined'
			) {
				// get the room's occupants
				var roomClients = connect.io.sockets.adapter.rooms[data.chatHash]; 
				
				// loop through the existing room connections
				for (var clientId in roomClients.sockets) {
					try {
						// disallow 'reconnection'
						if (clientId === socket.id) { continue; }
						
						// get the client's socket
						var clientSocket = connect.io.sockets.sockets[clientId];
						
						// if the client's userData is undefined, ignore
						if (typeof clientSocket.userData === 'undefined') { continue; }
						
						// if student, ignore
						if (
							typeof clientSocket.userData.memberType === 'undefined' ||
							(
								typeof clientSocket.userData.memberType !== 'undefined' &&
								clientSocket.userData.memberType !== data.memberType
							)
						) { continue; }
						
						// if id belongs to another teacher, ignore
						if (
							typeof clientSocket.userData.teacherID === 'undefined' ||
							(
								typeof clientSocket.userData.teacherID !== 'undefined' &&
								clientSocket.userData.teacherID != data.teacherID
							)
						) { continue; }
						
						// send general command
						connect.io.in(data.chatHash).emit('room.generalCommand', {command: constant.disconnect.teacher.forceReconnect, content: data});
						
						// overriding previous connections
						util.log("[ROOM_SOCKET] teacher overriding previous connections -> " + data.chatHash);
						
						// disconnect previous teacher session
						clientSocket.forceDisconnect = true;
						clientSocket.disconnect();
					} catch (ex) { continue; }
				}
			}
			
			// check if teacher disconnect timeout has already been set
			if (
				typeof connect.chatRooms[data.chatHash].teacherDisconnect !== 'undefined' && 
				connect.chatRooms[data.chatHash].teacherDisconnect !== false
			) {
				clearTimeout(connect.chatRooms[data.chatHash].teacherDisconnect);
				util.log('[TEACHER_CONNECT] cleared timeout for teacher disconnection -> ' + data.chatHash, 'green');
			}
			
			// return teacher index and set teacher disconnect to false
			connect.chatRooms[data.chatHash].teacher = data.teacherID;
			connect.chatRooms[data.chatHash].teacherDisconnect = false;
			
			// update the lessonOnair set the connect_flg to 1
			model.updateLessonOnair(
				{connect_flg: 1},
				{
					where : {chat_hash: data.chatHash}
				},
				data
			)
			
			// log action
			.then(function(lessonOnairs){
				util.log('[TEACHER_CONNECT] modified connect_flg to 1 -> ' + data.chatHash, 'green');
				
				// resolve
				return res(connect.chatRooms[data.chatHash]);
			})
			
			// catch any errors that may occur during the 'updating' phase
			.catch(function(errors){ return rej(errors); });
		})
		
		// if room creation was successful
		.then(function(room){ return resolve(room)})
		
		// catch any errors that may have occurred during room creation
		.catch(function(errors){ return reject(errors); });
	},
	
	/**
	 * disconnect the teacher and end the lesson
	 * @param obj -> will contain the teacher's information,
	 * @param resolve -> execute if the process was successful
	 * @param reject -> execute if the process failed
	 */
	disconnectTeacher: function(obj, resolve, reject){
		// check if the teachers array or data from teacher exists
		if (typeof obj.data === undefined) {
			return reject("reason_invalid_teacher_params");
		}
		
		// get data
		var data = obj.data;
		
		// logger
		util.log('[TEACHER_DISCONNECTION] disconnecting teacher -> ' + JSON.stringify(data), 'red');
		
		// check if chat room exists
		if (typeof connect.chatRooms[data.chatHash] !== 'undefined') {
			util.log('[TEACHER_DISCONNECTION] disconnecting teacher -> ' + data.chatHash);
			
			// clear student disconnection
			clearTimeout(connect.chatRooms[data.chatHash].studentDisconnect);
			connect.chatRooms[data.chatHash].studentDisconnect = true;
			
			// clear teacher disconnection
			clearTimeout(connect.chatRooms[data.chatHash].teacherDisconnect);
			connect.chatRooms[data.chatHash].teacherDisconnect = true;
		}
		
		// delete room
		model.deleteRoom(data.chatHash);
		
		// resolve
		return resolve();
	},
	
	/**
	 * disconnect the teacher and remove him/her from the room
	 * @param obj -> will contain the teacher's information
	 */
	teacherLeaveRoom: function(obj, socket, disconnection){		
		// get data
		var data = obj.data;
		var element = this;
		
		// check if room exists
		if (typeof connect.chatRooms[data.chatHash] === 'undefined') { 
			util.log('[TEACHER_LEAVE_ROOM] room does not exist -> ' + data.chatHash); 
			return; 
		}
		
		// check if teacher disconnect timer has already been set
		if (
			typeof connect.chatRooms[data.chatHash] !== 'undefined' && 
			typeof connect.chatRooms[data.chatHash].teacherDisconnect !== 'undefined' && 
			connect.chatRooms[data.chatHash].teacherDisconnect === false
		) {
			/* log message */
			util.log('[TEACHER_LEAVE_ROOM] setting timeout for teacher disconnection -> ' + data.chatHash);
			
			/* declare timeout disconnection */
			connect.chatRooms[data.chatHash].teacherDisconnect = setTimeout(function(){
				try {
					util.log('[TEACHER_LEAVE_ROOM] executing teacher disconnection -> ' + data.chatHash);
					
					// check if chat room exists
					if (typeof connect.chatRooms[data.chatHash] !== 'undefined') {
						util.log('[TEACHER_LEAVE_ROOM] teacher timedout -> ' + data.chatHash);
						
						// clear student disconnection
						clearTimeout(connect.chatRooms[data.chatHash].studentDisconnect);
						connect.chatRooms[data.chatHash].studentDisconnect = true;
						
						// clear teacher disconnection
						clearTimeout(connect.chatRooms[data.chatHash].teacherDisconnect);
						connect.chatRooms[data.chatHash].teacherDisconnect = true;
					}
					
					/* emit */
					return socket.in(data.chatHash).emit('room.generalCommand', {command: constant.disconnect.teacher.timeOut, content: data});
				} catch (e) { util.log('[TEACHER_LEAVE_ROOM] error in teacher room leave logic -> ' + data.chatHash); }
			}, 50000);
		}
		
	}
};