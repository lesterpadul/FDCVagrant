/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js');
var model = require('./model.js');

/* export student functions */
module.exports = {
	/**
	 * registers teacher in the teachers array
	 */
	registerTeacher: function(obj, resolve, reject){
		// check if the teachers array or data from teacher exists
		if (typeof obj.teachers === undefined || typeof obj.data === undefined) {
			return reject("reason_invalid_teacher_params");
		}	
		
		var teachers = obj.teachers;
		var data = obj.data;
		
		// get teacher index, and remove if existing
		var teacherIndex = util.getIndex(teachers, {teacherID: data.teacherID});
		util.log('[TEACHER] checking teacher teacher-> ' + JSON.stringify(data) + ' index-> ' + teacherIndex);

		// check if index is not a negative value
		if (teacherIndex > -1) {
			delete teachers[teacherIndex]; // remove
			util.log('[TEACHER] removing existing teacher connection' + teachers);
		}
		
		// insert into array
		teachers.push({teacherID: data.teacherID, socketID: data.socketID});
		util.log('[TEACHER] applied new index for teacher');
		
		// update the lessonOnair set the connect_flg to 1
		model.updateLessonOnair(
			{
				connect_flg: 1
			},
			{
				where : {
					chat_hash: data.chatHash
				}
			}
		)
		.then(function(){
			util.log('[TEACHER] modified connect_flg to 1');
			return resolve();
		})
		.catch(function(errors){
			return reject(errors);
		});
	},
	
	/**
	 * disconnect the teacher and end the lesson
	 * @param obj -> will contain the teacher's information,
	 * @param resolve -> execute if the process was successful
	 * @param reject -> execute if the process failed
	 */
	disconnectTeacher: function(obj, resolve, reject){
		// check if the teachers array or data from teacher exists
		if (typeof obj.teachers === undefined || typeof obj.data === undefined) {
			return reject("reason_invalid_teacher_params");
		}
		
		var teachers = obj.teachers;
		var data = obj.data;
		
		// get teacher index, and remove if existing
		var teacherIndex = util.getIndex(teachers, {teacherID: data.teacherID});
		util.log('[TEACHER] checking teacher teacher-> ' + JSON.stringify(data) + ' index-> ' + teacherIndex);
		
		// check if index is not a negative value
		if (teacherIndex > -1) {
			delete teachers[teacherIndex]; // remove
			util.log('[TEACHER] removing existing teacher connection' + teachers);
		}
		// clear the lesson
		model.clearLesson({chat_hash: data.chatHash})
		.then(function(){
			return resolve();
		})
		.catch(function(errors){
			return reject(errors);
		});
	}
};