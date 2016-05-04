/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js');
var DB = require('./database.js');
var element = null;

/* export */
module.exports = {
	
	/**
	 * function logAction
	 * @param log.onair_id
	 * @param log.chat_hash
	 * @param log.status
	 * @param log.action
	 * @param log.action_by
	 * @param log.method
	 * @param log.close_status
	 */
	logAction: function(log){
		return DB.onair_status_logs.create({
			onair_id: (typeof log.onair_id !== 'undefined') ? log.onair_id : null,
			chat_hash: (typeof log.chat_hash !== 'undefined') ? log.chat_hash : null,
			status: (typeof log.status !== 'undefined') ? log.status : null,
			action: (typeof log.action !== 'undefined') ? log.action : null,
			action_by: 3,
			method: (typeof log.method !== 'undefined') ? log.method : null,
			close_status: (typeof log.close_status !== 'undefined') ? log.close_status : null
		});
	}
};