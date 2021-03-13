/**
 * this file will contain the database configuration for
 * the lesson scheme
 */

/* set sequelize */
var sequelize = require("sequelize");
var constant = require("./constant.js");
var util = require("./util.js");
var logger = require("./logger.js");
var ssl = require("./ssl.js");

/* set connection */
var db = new sequelize(
	ssl.dbName,
	ssl.dbUser,
	ssl.dbPass, 
	{
		dialect : "mysql", 
		timezone : ssl.dbTime, 
		host: ssl.dbHost,
		logging: function(str){
		    util.log("[SQL] " + str, 'white', 'black');
		}
	}
);

/* try connecting to the database */
db.authenticate()
.then(function(errors) {
	/* initialize db on logger with the current module export */
	logger.dbInit(module.exports);
	/* check if errors exist */
	if (typeof errors !== 'undefined') {
		util.log(errors, 'white', 'red');
		process.exit();
		logger.create("NJSES2", "database");
	} else {
		logger.create("NJSNS2", "database");
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
		lesson_finish: sequelize.INTEGER,
		connection_type: sequelize.STRING,
		chat_hash: sequelize.STRING,
		wait_start_time: sequelize.DATE,
		wait_end_time : sequelize.DATE,
		start_time: sequelize.DATE,
		end_time: sequelize.DATE,
		connect_id: sequelize.INTEGER,
		class_id: sequelize.INTEGER,
		chapter_id: sequelize.INTEGER,
		lesson_text_id: sequelize.INTEGER,
		textbook_category_id: sequelize.INTEGER,
		teacher_memo: sequelize.STRING,
		lesson_memo: sequelize.STRING,
		lesson_memo_valid_flg: sequelize.INTEGER,
		lesson_memo_disp_flg: sequelize.INTEGER,
		lesson_memo_read_flg: sequelize.INTEGER,
		workstation_id: sequelize.INTEGER,
		lesson_memo_sent_time: sequelize.DATE,
		user_agent: sequelize.STRING(100),
		lesson_type: sequelize.INTEGER,
		lesson_schedule_id: sequelize.INTEGER,
		web_rtc_type: sequelize.INTEGER,
		created: sequelize.DATE,
		modified: sequelize.DATE
	}, {
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'modified',
		deletedAt: false
	}),

	/* recruit lesson onairs */
	recruit_lesson_onairs:  db.define('recruit_lesson_onairs', {
		recruit_teacher_id: sequelize.INTEGER,
		admin_id: sequelize.INTEGER,
		status: sequelize.INTEGER,
		connect_flg : sequelize.INTEGER,
		chat_hash: sequelize.STRING
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
		connection_type: sequelize.STRING,
		chat_hash: sequelize.STRING,
		wait_start_time: sequelize.DATE,
		wait_end_time : sequelize.DATE,
		start_time: sequelize.DATE,
		end_time: sequelize.DATE,
		connect_id: sequelize.INTEGER,
		class_id: sequelize.INTEGER,
		chapter_id: sequelize.INTEGER,
		lesson_text_id: sequelize.INTEGER,
		textbook_category_id: sequelize.INTEGER,
		teacher_memo: sequelize.STRING,
		lesson_memo: sequelize.STRING,
		lesson_memo_valid_flg: sequelize.INTEGER,
		lesson_memo_disp_flg: sequelize.INTEGER,
		lesson_memo_read_flg: sequelize.INTEGER,
		workstation_id: sequelize.INTEGER,
		lesson_memo_sent_time: sequelize.DATE,
		user_agent: sequelize.STRING(100),
		lesson_type: sequelize.INTEGER,
		lesson_schedule_id: sequelize.INTEGER,
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
	}),
	
	/* teacher status table */
	teacher_status: db.define('teacher_status', {
		teacher_id: sequelize.INTEGER,
	    workstation_id: sequelize.STRING(100),
	    status: sequelize.INTEGER,
	    remarks1: sequelize.INTEGER,
	    remarks2: sequelize.INTEGER,
	    created: sequelize.DATE,
	    modified: sequelize.DATE
	}, {
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'modified',
		deletedAt: false,
		tableName: 'teacher_status'
	}),
	
	/* teacher status logs table */
	teacher_status_logs: db.define('teacher_status_logs', {
		teacher_id: sequelize.INTEGER,
	    workstation_id: sequelize.STRING(100),
	    status: sequelize.INTEGER,
	    remarks1: sequelize.INTEGER,
	    remarks2: sequelize.INTEGER,
	    created: sequelize.DATE,
	    modified: sequelize.DATE
	}, {
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'modified',
		deletedAt: false,
		tableName: 'teacher_status_logs'
	}),

	/* general rtc logs table */
	general_rtc_logs: db.define('general_rtc_logs', {
		id : {
			type          : sequelize.INTEGER,
			autoIncrement : true,
			primaryKey    : true
		},
		chat_hash: {
			type       : sequelize.STRING,
			primaryKey : true
		},
		log: {
			type       : sequelize.STRING,
			primaryKey : true
		},
		code: sequelize.STRING(50),
		remarks: sequelize.STRING,
		action_type: sequelize.INTEGER,
		created_ip : sequelize.STRING,
		modified_ip: sequelize.STRING
	}, {
		timestamps: true,
		createdAt : 'created',
		updatedAt : 'modified'
	})
};