/* load dependencies */
var chalk = require('chalk');
var moment = require('moment');
var _ = require('underscore');
var promise = require("promise");

module.exports = {
	/**
	 * try executing a function
	 * @param f: function to be executed
	 */
	try: function(f){
		return new promise(f);
	},
	
	/**
	 * log the message for repudiation purposes
	 * @param message: message that will be logged
	 * @param color: color of the text
	 * @param bgColor: color of the backgorund color
	 */
	log: function(message, color, bgColor) {
		/* set color */
		bgColor = (typeof bgColor !== 'undefined') ? 'bg' + bgColor.charAt(0).toUpperCase() + bgColor.slice(1) : 'bgBlack';
		color = (typeof color ==='undefined') ? 'white' : color;

		/* format message */
		message = this.getCurrentTime() + " >> " + message;
		console.log(message);
	},
	
	/**
	 * log error messages
	 * @param message : content of error 
	 */
	logError: function(message) {
		/* error message should not be empty */
		if (typeof message === 'undefined' || message.length === 0) {
			return false;
		}
		
		/* log the error */
		return this.log("[ERROR] " + message, 'red', 'white');
	},
	
	/**
	 * get the current time
	 * @param format: set the current format
	 */
	getCurrentTime: function(format) {
		/* set format */
		format = (typeof format === 'undefined') ? "YYYY-MM-DD HH:mm:ss" : format;
		
		/* return format */
		return moment().format(format);
	},
	
	/**
	 * get the index of an element
	 * from an array
	 * @param list -> array
	 * @param filter -> search in array for a specific value
	 */
	getIndex: function(list, filter){
		var index = _.findLastIndex(list, filter);
		return index;
	},
	
	/**
	 * remove useless indices
	 * in an array
	 * @param: array
	 */
	compact: function(list){
		return _.compact(list);
	},
	
	/**
	 * extend the object
	 */
	extend: function(parent, child){
		return _.extend({}, parent, child);
	},
	
	/**
	 * output rooms
	 */
	outputRooms: function(rooms){
		var elem = this;
		var arrs = [];
		rooms.map(function(element, index){
			arrs.push(element.room);
		});
		elem.log("[ROOMS] -> " + JSON.stringify(arrs), 'magenta');
	},

	/* find admin index */
	findObjectIndex: function(obj, conditions) {
		for(var x in obj) {
			var index = x;
			var match = 0;
			for (var c in conditions) {
				if (obj[x][c] == conditions[c]) { match++; }
			}
			if (Object.keys(conditions).length == match) {
				return index;
			}
		}
		return -1;
	},
	
	/**
	 * count the number of rooms
	 * @param: room -> collection of rooms
	 */
	getRoomLength: function(rooms){
		return _.size(rooms);
	}
};