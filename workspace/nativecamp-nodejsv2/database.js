/**
 * this file will contain the database configuration for
 * the lesson scheme
 */

/* set sequelize */
var sequelize = require("sequelize");
var constant = require("./constant.js");
var util = require("./util.js");

/* set connection */
var db = new sequelize(
	constant.dbName,
	constant.dbUser,
	constant.dbPass, 
	{
		dialect : "mysql", 
		timezone : constant.dbTime, 
		host: constant.dbHost,
		logging: function(str){
		    util.log("[SQL] " + str, 'white', 'black');
		}
	}
);

/* try connecting to the database */
db.authenticate()
.then(function(errors) {
	/* check if errors exist */
	if (typeof errors !== 'undefined') {
		util.log(errors, 'white', 'red');
		process.exit();
	} else {
		util.log("[DB] CONNECTED TO THE DATABASE", 'green');
	}
});

/* exports tables and database connection */
module.exports = {
	sequelize: sequelize,
	connection: db,
	/* lesson onairs */
	lesson_onairs:  db.define('lesson_onairs', {
		teacher_id: sequelize.INTEGER,
		user_id: sequelize.INTEGER,
		status: sequelize.INTEGER,
		connect_flg : sequelize.INTEGER,
		chat_hash: sequelize.STRING,
		wait_start_time: sequelize.DATE,
		wait_end_time : sequelize.DATE,
		start_time: sequelize.DATE,
		end_time: sequelize.DATE,
		class_id: sequelize.INTEGER,
		chapter_id: sequelize.INTEGER,
		lesson_text_id: sequelize.INTEGER,
		textbook_category_id: sequelize.INTEGER,
		teacher_memo: sequelize.STRING,
		lesson_memo: sequelize.STRING,
		lesson_memo_disp_flg: sequelize.INTEGER,
		user_agent: sequelize.STRING(100),
		lesson_type: sequelize.INTEGER,
		web_rtc_type: sequelize.INTEGER,
		created: sequelize.DATE,
	    modified: sequelize.DATE
	}, {
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'modified',
		deletedAt: false
	}),
	
	/* lesson onair logs */
	lesson_onairs_logs:  db.define('lesson_onairs_logs', {
		onair_id: sequelize.INTEGER,
		teacher_id: sequelize.INTEGER,
		user_id: sequelize.INTEGER,
		status: sequelize.INTEGER,
		connect_flg : sequelize.INTEGER,
		lesson_finish: sequelize.INTEGER,
		chat_hash: sequelize.STRING,
		wait_start_time: sequelize.DATE,
		wait_end_time : sequelize.DATE,
		start_time: sequelize.DATE,
		end_time: sequelize.DATE,
		class_id: sequelize.INTEGER,
		chapter_id: sequelize.INTEGER,
		lesson_text_id: sequelize.INTEGER,
		textbook_category_id: sequelize.INTEGER,
		teacher_memo: sequelize.STRING,
		lesson_memo: sequelize.STRING,
		lesson_memo_disp_flg: sequelize.INTEGER,
		user_agent: sequelize.STRING(100),
		lesson_type: sequelize.INTEGER,
		web_rtc_type: sequelize.INTEGER,
		created: sequelize.DATE,
	    modified: sequelize.DATE
	}, {
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'modified',
		deletedAt: false
	}),
	
	/* onair status logs */
	onair_status_logs: db.define('onair_status_logs', {
		onair_id: sequelize.INTEGER,
	    chat_hash: sequelize.STRING(100),
	    status: sequelize.INTEGER,
	    action: sequelize.INTEGER,
	    action_by: sequelize.INTEGER,
	    method: sequelize.INTEGER,
	    close_status: sequelize.INTEGER,
	    created: sequelize.DATE,
	    modified: sequelize.DATE
	}, {
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'modified',
		deletedAt: false
	})
};