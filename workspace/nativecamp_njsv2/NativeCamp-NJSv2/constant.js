/* require fs */
var fs = require("fs");

/* declare constants */
module.exports = {
	/* average lesson time is 26 minutes */
	lesson: {
		lessonTime : 1560
	},
	
	/* alert messages */
	log: {
		waitStart : "先生:待機開始",
		lessonStart : "生徒:レッスン開始",
		timeoutUpdateTeacher : "先生:レッスン経過時間終了(定期更新)",
		timeoutUpdateStudent : "生徒:レッスン経過時間終了(定期更新)",
		timeoutRequestTeacher : "先生:レッスン経過時間終了(リクエスト)",
		timeoutRequestStudent : "生徒:レッスン経過時間終了(リクエスト)",
		logoutTeacher : "先生:退室",
		logoutStudent : "生徒:退室",
		lessonEndTeacher : "先生:レッスン終了",
		lessonEndStudent : "生徒:レッスン終了"
	},
  	
	/* error messages */
	reason: {
		noOnairInfo : "reason_no_onair_info",
		failedMemberType : "reason_failed_member_type",
		failedRegistration : "reason_failed_registration",
		noTeacherExist : "reason_no_teacher_exist",
		noStudentExist : "reason_no_student_exist",
		teacherLogout : "reason_teacher_logout",
		teacherChat : "reason_teacher_chat",
		teacherNotChat : "reason_teacher_not_chat",
		studentLogout : "reason_student_logout",
		teacherTimeout : "reason_teacher_timeout",
		studentTimeout : "reason_student_timeout"
	},
	
	/* disconnect patterns */
	disconnect: {
		teacher: {
			finished: "teacherLessonFinished",
			sudden: "teacherSuddenDisconnect",
			others: "teacherLessonDisconnectOthers",
			timeOut: "teacherTimedOut",
			forceReconnect: "teacherForceReconnect"
		},
		student: {
			finished: "studentLessonFinished",
			sudden: "studentSuddenDisconnect",
			timeOut: "studentTimedOut",
			forceReconnect: "studentForceReconnect"
		}
	},
	
	/* lesson states */
	onair: {
		wait : "1",
		reservation : "2",
		chat : "3"
	},

	/* Codelog activation */
	codelogActive : false,

	/**
	 * Codelogs are list of logs with description and type
	 * @NJSNS = notification socket code logs
	 * @NJSNG = notification general code logs
	 * @NJSND = notification disconnection code logs
	 * @NJSNM = notification model code logs
	 * @NJSES = error socket code logs
	 * @NJSEG = error general code logs
	 * @NJSED = error disconnection code logs
	 * @NJSEM = error model code logs
	 */
	codelogs: {

		/*** NOTIFICATIONS LOGS ***/
		NJSNS1 : {desc: "Listening to port success", type: 0},
		NJSNS2 : {desc: "Database connection success", type: 0 },
		NJSNS3 : {desc: "Chat room deleted after 1 hour : ", type: 0 },
		NJSNS4 : {desc: "Peer connection", type: 0 },
		NJSNS5 : {desc: "Peer disconnection", type: 0 },
		NJSNS6 : {desc: "Leave socket", type: 0 },
		
		NJSNG1 : {desc: "[socket.teacher] register teacher to room", type: 0},
		NJSNG2 : {desc: "[socket.teacher] removed teacher from room", type: 0},
		NJSNG3 : {desc: "[socket.teacher] set connect_flg to 1", type: 0},
		NJSNG4 : {desc: "Connecting to room", type: 0},
		NJSNG5 : {desc: "Add teacher back to roomIndex", type: 0},
		NJSNG6 : {desc: "[socket.student] register student to room", type: 0},
		NJSNG7 : {desc: "[socket.student] removed student from room", type: 0},
		NJSNG8 : {desc: "[socket] connected to room", type: 0},
		NJSNG11 : {desc: "Room checking", type: 0},
		NJSNG12 : {desc: "Room checking success", type: 0},
		
		NJSND1 : {desc: "[socket.student] Remove student from room ", type: 0},
		NJSND2 : {desc: "[socket.teacher] removed room on teacher disconnection", type: 0},
		NJSND3 : {desc: "Start Disconnection action", type: 0},
		NJSND4 : {desc: "Disconnection success action", type: 0},
		NJSND5 : {desc: "[socket.teacher] sudden user disconnection", type: 3},

		/*** ERROR LOGS ***/
		NJSES1 : {desc: "[socket] Listening to port fail", type: 1},
		NJSES2 : {desc: "[socket] Database connection fail", type: 1},

		NJSEG1 : {desc: "Invalid Parameters Teacher", type: 1 },
		NJSEG2 : {desc: "Invalid Parameters User", type: 1 },
		NJSEG3 : {desc: "Room already occupied", type: 1},
		NJSEG4 : {desc: "[socket] Fatal error during registerTeacher : ", type: 1},
		NJSEG5 : {desc: "Student has no room", type: 1},
		NJSEG6 : {desc: "Student has already occupied a room", type: 1},
		NJSEG7 : {desc: "Fatal Teacher Timeout Disconnection", type: 1},
		NJSEG8 : {desc: "Fatal during on AddStudentTestLog when insert users_media_test", type: 1},
		NJSEG9 : {desc: "Unknown chathash", type: 1},
		NJSEG10 : {desc: "Unknown member type", type: 1},
		NJSEG11 : {desc: "[socket] failed to connect room", type: 1},
		NJSEG12 : {desc: "[socket] general command fail", type: 1},
		NJSEG13 : {desc: "Room checking fail", type: 1},
		
		NJSED1 : {desc: "[socket] fatal error during disconnectTeacher", type: 1},
		NJSED2 : {desc: "[socket] fatal error during disconnectStudent", type: 1},
		NJSED3 : {desc: "[socket] disconnection fail", type: 1},
		NJSED4 : {desc: "[socket] cannot disconnect because userData is empty", type: 1},

		NJSEM1 : {desc: "[socket] lesson onair does not exist", type: 1},
		NJSEM2 : {desc: "[socket] failed to create lesson onairs log", type: 1},
		NJSEM3 : {desc: "[socket] failed to find on lesson onairs", type: 1},
		NJSEM4 : {desc: "[socket] failed to create teacher status", type: 1},
		NJSEM5 : {desc: "[socket] failed to update teacher status", type: 1},
		NJSEM6 : {desc: "[socket] failed to find on teacher status", type: 1},
		NJSEM7 : {desc: "[socket] failed to create teacher status log", type: 1},
		NJSEM8 : {desc: "[socket] failed to create onair status log", type: 1},
		NJSEM9 : {desc: "[socket] failed to delete lesson onairs", type: 1},
	}
};