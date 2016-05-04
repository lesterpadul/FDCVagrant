/**
 * this file will contain all the business logic related to
 * the lesson scheme
 */

/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js'); 
var db = require('./database.js');

/* export models functions */
module.exports = {
	/**
	 * update lesson onairs table
	 * @param: obj -> contains rows of the lessonOnairs table
	 */
	updateLessonOnair: function(values, where){
		return db.lesson_onairs.update(values, where);
	},
	
	/**
	 * clear the existing lesson
	 * @param: condition -> condition query
	 */
	clearLesson: function(condition){
		return util.try(function(resolve, reject){
			db.lesson_onairs
			.findOne({
				where: condition
			})
			.then(function(onairs){
				// set vars
				onairs = onairs.dataValues;
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
						lesson_finish: 1
					}
				);
				
				// remove the lesson_onairs table
				db.lesson_onairs.destroy({where: condition});
				
				// import lesson onair logs
				db.lesson_onairs_logs
				.create(onairsLog)
				.then(function(){
					return resolve(onairs);
				})
				.catch(function(errors){
					return reject(errors);
				});
			})
			.catch(function(errors){
				return reject(errors);
			});
		});
	}
};