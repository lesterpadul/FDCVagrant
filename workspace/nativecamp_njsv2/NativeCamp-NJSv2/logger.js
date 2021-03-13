/* set dependencies */
var db = require('./database.js');
var util = require('./util.js');
var constant = require('./constant.js');

var logs = constant.codelogs;

/* export log functions */
module.exports = {
	/**
	 * re initialize db
	 * @param  Sequelize dbExport 
	 * @return void          
	 */
	dbInit: function(dbExport) {
		db = dbExport;
	},

	/**
	 * Create logs to general_rtc_logs
	 * @param  String code       code of logs
	 * @param  String chatHash   chathash of user
	 * @param  String remarks    additional data to log
	 * @return void
	 */
	create: function(code, chatHash, remarks) {
		if (typeof db == 'undefined') {
			util.logError('[LOGGER] [' + code + '] Database not yet ready');
			return;
		}
		if (typeof logs[code] == 'undefined') {
			util.logError('[LOGGER] [' + code + '] not existed');
			return;
		}
		if (typeof chatHash == 'undefined' || chatHash == '') {
			util.log('[LOGGER] ['+ code +'] [NCH] ' + logs[code].desc, 'yellow');
			return;
		}
		
		var remarkStr = '';
		var ipAddress = null;

		/* checks if remarks is undefined */
		if (typeof remarks != 'undefined') {
			// If it is an object stringify
			// otherwise remarks is a string
			if (typeof remarks == 'object') {
				remarkStr = JSON.stringify(remarks);
				// look for ip address in remarks
				if (
					typeof remarks.data != 'undefined' &&
					typeof remarks.data.ipAddress != 'undefined'
				) {
					ipAddress = remarks.data.ipAddress;
				}
			} else {
				remarkStr = remarks;
			}
		}

		// if codelog is deactivate 
		if (!constant.codelogActive) {
			// util.log('[LOGGER] [' + code + '] : ' + logStr, 'yellow');
			return;
		}
		
		// try saving the general rtc logs
		util.try(function(res, rej){
			/* inserts to general_rtc_logs */
			db.general_rtc_logs.create({
				log         : logs[code].desc,
				code        : code,
				chat_hash   : chatHash,
				action_type : logs[code].type,
				created_ip  : ipAddress,
				remarks     : remarkStr
			}).then(function() {
				util.log('[LOGGER] [' +code+ '] : ' + logs[code].desc, 'yellow');
				return res();
			}).catch(function(err) {
				util.logError('[LOGGER][' +code+ '] =>' + err.message);
				return rej(err);
			});
		})
		.then(function(){})
		.catch(function(error){ 
			util.logError(" [LOGGER_SERVER_FAIL] " + JSON.stringify(error));
		});
	}
};