/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js');
var model = require('./model.js');
var element = null;
var connect = require('./connect.js');

/* export */
module.exports = {
	sendChat: function(obj,resolve){
		resolve();
	},
	addActionLog: function(values){
		model.logAction(values);
	},
	deleteRoom: function(room){
		model.deleteRoom(room);
	}
};