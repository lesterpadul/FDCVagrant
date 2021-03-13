/* set dependencies */
var util = require('./util.js');
var constant = require('./constant.js');
var db = require('./database.js');
var model = require('./model.js');
var connect = require('./connect.js');
var logger = require('./logger.js');

/* export student functions */
module.exports = {
	registerAdmin: function(obj, reject, socket){	
		util.log("[ADMIN] adding admin to admin array", 'green');
		
		// check if the admins array or data from admin exists
		if (typeof obj.data === undefined) {
			logger.create('NJSEG2', '', obj);
			return reject("reason_invalid_admin_params");
		}
		
		// set vars
		var data = obj.data;

		/* add admin to array */
		var count = Object.keys(connect.admins).length;
		var adminIndex = (count <= 0) ? 0 : Object.keys(connect.admins)[count-1];
		/* check if index is a number */
		if (isNaN(adminIndex) == true) { return reject("Last object index is not a valid number"); } 
		adminIndex = parseInt(adminIndex) + 1;

		connect.admins[adminIndex] = {
			adminID: data.adminID,
			ip: data.ipAdd
		};
		
		var index = util.findObjectIndex(connect.connectAdminIps, {ip: data.ipAdd});
		
		if (index === -1) {
			/* insert ip address to array */
			var count = Object.keys(connect.connectAdminIps).length;
			var ipIndex = (count <= 0) ? 0 : Object.keys(connect.connectAdminIps)[count-1];
			/* check if index is a number */
			if (isNaN(ipIndex) == true) { return reject("Last object index is not a valid number"); } 
			ipIndex = parseInt(ipIndex) + 1;
			connect.connectAdminIps[ipIndex] = {ip: data.ipAdd};
		}

		var ips = [];
		for(var ip in connect.connectAdminIps) {
			ips.push(connect.connectAdminIps[ip].ip);
		}

		data.connectAdminIps = ips;

		// set socket information
		socket.userData = data;

		socket.join(data.chatHash);

		// inform peers in the room
		socket.broadcast.to(data.chatHash).emit("room.generalCommand",
			{
				command:"roomConnected",
				content:data
			}
		);

		socket.emit('common.connectedToRoom',
			{
				memberType: data.memberType,
				connectAdminIps: ips,
				selectedIp: connect.selected_ip
			}
		);
	},

	/* disconnectAdmin */
	disconnectAdmin: function(obj, socket, reject){
		util.log("[ADMIN] removing admin to admin array", 'green');

		// check if the admins array or data from admin exists
		if (typeof obj.data === undefined) {
			return reject("reason_invalid_admin_params");
		}

		var data = obj.data;

		var index = util.findObjectIndex(connect.admins, {
			adminID: data.adminID,
			ip: data.ipAdd
		});
		if (index === -1) { return reject("reason_admin_not_exist"); }
		delete connect.admins[index];

		// get the ip index
		var ipIndex = util.findObjectIndex(connect.admins, {ip: data.ipAdd});

		if (ipIndex == -1) {
			// delete ip from valid ip
			var index = util.findObjectIndex(connect.connectAdminIps, {ip: data.ipAdd});
			delete connect.connectAdminIps[index];

			var ips = [];
			for(var ip in connect.connectAdminIps) {
				ips.push(connect.connectAdminIps[ip].ip);
			}

			socket.join(data.chatHash);

			socket.broadcast.to(data.chatHash).emit("room.generalCommand",
				{
					command:"removeAdminIp",
					content:{
						ip: data.ipAdd,
						connectAdminIps: ips
					}
				}
			);
		}
			
	}

};