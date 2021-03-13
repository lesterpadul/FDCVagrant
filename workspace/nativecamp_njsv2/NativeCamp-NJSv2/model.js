/**
 * this file will contain all the business logic related to
 * the lesson scheme
 */

/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js'); 
var db = require('./database.js');
var moment = require('moment');
var logger = require('./logger.js');
var connect = require("./connect.js");

/* export models functions */
module.exports = {
	/**
	 * update lesson onairs table
	 * @param: obj -> contains rows of the lessonOnairs table
	 */
	updateLessonOnair: function(values, where, data){
		util.log("[UPDATE_LESSON_ONAIR] values -> " + JSON.stringify(values) + " condition -> " + JSON.stringify(where));

		// set lesson onairs
		var model = db.lesson_onairs;

		// change model if recruit camera check
		if (data.memberType == 'recruit_camera_check') {
			model = db.recruit_lesson_onairs;
		}

		// update
		return model.update(values, where);
	},
	
	/**
	 * clear the existing lesson
	 * @param: condition -> condition query
	 * @param: data -> use for logging
	 */
	clearLesson: function(condition, data, lessonFinish){
		util.log("[CLEAR_LESSON] clearing lesson -> " + JSON.stringify(condition));
		lessonFinish = (typeof lessonFinish !== 'undefined') ? lessonFinish : 0;
		
		return util.try(function(resolve, reject){
			db.lesson_onairs
			.findOne({
				where: condition
			})
			.then(function(onairs){
				if (!onairs) {
					util.log("[CLEAR_LESSON] no lesson onairs!");
					return resolve("reason_no_onairs");
				}
				
				// set vars
				onairs = onairs.dataValues;
				
				// if lesson_type is onairs, do not delete lesson
				// wait for the cron
				if (onairs.lesson_type == 2) {
					
					// get the reservation start and end time
					var lessonEndTime = moment(onairs.end_time).unix();
					var lessonCurTime = moment(util.getCurrentTime()).unix();
					
					// log
					util.log("[CLEAR_LESSON] the current lesson is a reservation lesson!");
					util.log("[CLEAR_LESSON] reservation lesson end time -> " + lessonEndTime);
					util.log("[CLEAR_LESSON] reservation lesson current time -> " + lessonCurTime);
					
					// if projected lesson end time is lesser than
					// the current time
					if (lessonEndTime > lessonCurTime) { 
						return resolve(onairs);
					}
					
					// log
					util.log("[CLEAR_LESSON] clearing reservation lesson!");
				}
				
				// get the onairs ID
				var onairID = onairs.id;
				
				// delete onairs_id
				delete onairs.id;
				
				// set the end_time to the current time
				onairs.end_time = util.getCurrentTime();
				
				// add additional column values
				var onairsLog = util.extend(
					onairs,
					{
						onair_id: onairID,
						lesson_finish: lessonFinish
					}
				);
				
				// if status is not ongoing lesson
				if (onairs.status !== 3) {
					
					// remove the lesson_onairs table value
					db.lesson_onairs
					.destroy({where: condition})
					
					// if lesson onair destruction was successful
					.then(function(){ return resolve(onairs); })
					
					// if an error occurred during lesson onair destruction
					.catch(function(errors){ return reject(errors); });
					
				// if ongoing lesson
				} else {
					
					// check if lesson_onair_logs with
					// chat_hash already exists
					db.lesson_onairs_logs
					.findOne({
						attributes: ['id'],
						where: condition
					})
					
					// save or ignore after locating lesson log
					.then(function(lessonOnairLogsChecker){
						// if lesson_onairs_logs alreay exists
						if (lessonOnairLogsChecker) {
							lessonOnairLogsChecker = lessonOnairLogsChecker.dataValues;
							return resolve(lessonOnairLogsChecker);
						}
						
						// create new lesson_onairs_logs
						db.lesson_onairs_logs
						.create(onairsLog)
						.then(function(lessonLog){
							// remove the lesson_onairs table value
							db.lesson_onairs.destroy({where: condition})
							
							// if lesson onair destruction was successful
							.then(function(){ return resolve(lessonLog); })
							
							// if an error occurred during lesson onair destruction
							.catch(function(errors){ return reject(errors); });
						})
						
						// catch when an error occurs during the creation phase
						.catch(function(errors){
							logger.create('NJSEM2', condition.chat_hash, {data: data, errors: errors});
							return reject(errors);
						});
					})
					
					// catch errors
					.catch(function(errors){ return reject(errors); });
				}
			})
			.catch(function(errors){ return reject(errors); });
		});
	},
	
	/**
	 * a function that will set the teacher's status
	 * @param obj.teacher_id -> teacher's ID
	 * @param obj.workstation_id -> teacher's worksation
	 * @param obj.status -> which status to change
	 * @param obj.remarks1 -> for 'others' status
	 * @param obj.remarks2 -> for 'others' status
	 * @param obj.ip_address -> teacher's ip address 
	 */
	setTeacherStatusLogs: function(obj){
		var elem = this;
		/* update the teacher's status */
		util.try(function(resolve, reject){
			/* get the teacher's current status */
			db.teacher_status
			.findOne({
				where: {
					teacher_id: obj.teacher_id
				}
			})
			.then(function(teacherStatus){
				/* if teacher has an existing status, update the status */
				if (!teacherStatus) {
					db.teacher_status.create({
						teacher_id: obj.teacher_id,
						workstation_id: obj.workstation_id,
						status: obj.status
					})
					.then(function(){ 
						resolve();
					}, function(error){ 
						logger.create('NJSEM4', obj.chat_hash, {data: obj, errors: error});
						reject({reason: "reason_unable_to_save_status", error: error}); 
					});
				
				/* else, create the teacher's status */
				} else {
					var currentTeacherStatus = teacherStatus.dataValues.status;
					currentTeacherStatus = parseInt(currentTeacherStatus);
					
					/* check if the last teacher status is lesson */
					if (currentTeacherStatus !== 1) {
						reject({reason: "reason_latest_teacher_status_is_not_lesson", error: ""});
					}
					
					/* update teacher's status */
					db.teacher_status.update({
						status: obj.status,
						workstation_id: obj.worksation_id
					}, {
						where : {teacher_id: obj.teacher_id}
					})
					.then(function(test){
						resolve();
					}, function(error){
						util.logError(error);
						logger.create('NJSEM5', obj.chat_hash, {data: obj, errors: error});
						reject({reason: "reason_unable_to_save_status", error: error});
					});
				}
			})
			
			/* catch any errors that may occur during the saving of teacher's status */
			.catch(function(error){
				logger.create('NJSEM3', obj.chat_hash, {data:obj, errors: error});
				util.logError(error);
				reject({reason: "reason_unable_to_locate_teacher_status", error: error});
			});
		})
		
		/* if no errors occurred while setting the teacher's status */
		.then(function(){
			db.teacher_status_logs
			.findOne({
				where: {
					teacher_id: obj.teacher_id
				},
				order: 'id DESC'
			})
			.then(function(teacherStatusLogs){
				var insertLog = false;
				
				/* create new teacher status log, if has no existing logs */
				if (!teacherStatusLogs) {
					insertLog = true;
				}
				
				/* if teacher has existing logs, but latest log is not the same as current */
				if ((typeof teacherStatusLogs.dataValues !== 'undefined' && teacherStatusLogs.dataValues.status !== obj.status)) {
					insertLog = true;
				}

				/* if allowd to save new log */
				if (insertLog) {
					db.teacher_status_logs.create({
						teacher_id: obj.teacher_id,
						workstation_id: obj.workstation_id,
						status: obj.status
					})
					.then(function(){ 
						util.log('[TEACHER_STATU] update teacher status to -> ' + obj.status);
					}, function(error){
						logger.create('NJSEM7', obj.chat_hash, {data:obj, errors: error});
						util.logError(error);
					});
				}
			});
		})
		
		/* catch any errors that may occur while setting the teacher's status */
		.catch(function(error){
			logger.create('NJSEM6', obj.chat_hash, {data: obj, errors: error});
			util.logError("[TEACHER_STATUS] -> " + JSON.stringify(error));
		});
	},
	
	/**
	 * function logAction
	 * @param log.onair_id
	 * @param log.chat_hash
	 * @param log.status
	 * @param log.action
	 * @param log.action_by
	 * @param log.method
	 * @param log.close_status
	 * @param data ->for logging
	 */
	logAction: function(log){
		return db.onair_status_logs.create({
			chat_hash: (typeof log.chat_hash !== 'undefined') ? log.chat_hash : null,
			status: (typeof log.status !== 'undefined') ? log.status : null,
			action: (typeof log.action !== 'undefined') ? log.action : null,
			action_by: 2,
			method: (typeof log.method !== 'undefined') ? "socket | " + log.method : null,
			close_status: (typeof log.close_status !== 'undefined') ? log.close_status : null
		})
		.then(function(){})
		.catch(function(errors){
			logger.create('NJSEM8', log.chat_hash, {data: log, errors: errors});
		});
	},
	
	/**
	 * function deleteRoom
	 * @param chatHash: room's name
	 */
	deleteRoom: function(chatHash){
		// if valid room
		if (typeof connect.chatRooms[chatHash] !== 'undefined') { 
			delete connect.chatRooms[chatHash]; 
			util.log("[DELETE_ROOM] deleted room -> " + chatHash);
			
		// if not valid room
		} else { util.log("[DELETE_ROOM] unable to delete room -> " + chatHash); }
	},

	/**
	 * check if a student or teacher has any lesson onairs data
	 * @param conditions: related conditions for lesson
	 */
	hasLessonOnair: function(conditions, obj){
		var model = db.lesson_onairs;

		// admin recruiter
		if (obj.memberType == 'admin_recruiter') {
			model = db.recruit_lesson_onairs;
		}

		// return model
		return model.findOne({attributes: ['id'], where: conditions});
	}
};