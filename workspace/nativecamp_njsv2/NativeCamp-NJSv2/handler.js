/**
 * - this file will contain the socket events
 * to and from the signaling server
 * - function list for the signaling actions
 */
/* export */
module.exports = {
	teacher: require('./handler.teacher.js'),
	student: require('./handler.student.js'),
	admin: require('./handler.admin.js'),
	common: require('./handler.common.js')
};