/* require fs */
var fs = require("fs");

/* declare constants */
module.exports = {
	/* set default port */
	port: 8082,
	
	/* database information */
	dbName: "english",
	dbHost: "localhost",
	dbUser: "devel",
	dbPass: "",
	dbTime: "+09:00", // set to japanese time
	
	/* ssl information */
	ssl: {
		key: fs.readFileSync('./ssl/key.pem'),
		cert: fs.readFileSync('./ssl/cert.pem'),
		passphrase : "cde3bgt5"
	},
	
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
	
	/* lesson states */
	onair: {
		wait : "1",
		reservation : "2",
		chat : "3"
	}
};