/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js');
var db = require('./database.js');

/* export student functions */
module.exports = {
	registerStudent: function(obj, resolve, reject){
		util.log("[STUDENT] adding student to the student array");
		util.log("[STUDENT]" + JSON.stringify(obj));
		
		// check if the students array or data from student exists
		if (typeof obj.students === undefined || typeof obj.data === undefined) {
			return reject("reason_invalid_student_params");
		}	
		
		var students = obj.students;
		var data = obj.data;
		
		// get teacher index, and remove if existing
		var studentIndex = util.getIndex(students, {studentID: data.studentID});
		util.log('[STUDENT] checking student student-> ' + JSON.stringify(data) + ' index-> ' + studentIndex);

		// check if index is not a negative value
		if (studentIndex > -1) {
			delete students[studentIndex]; // remove
			util.log('[STUDENT] removing existing student connection' + students);
		}
		
		// insert into array
		students.push({studentID: data.studentID, socketID: data.socketID});
		util.log('[STUDENT] applied new index for student');
		
		return resolve();
	}
};