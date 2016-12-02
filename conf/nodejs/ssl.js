/* require fs */
var fs = require("fs");

/* ssl information */
module.exports = {
	/* set default port */
	port: 3000,
	
	/* database information */
	dbName: "english",
	dbHost: "localhost",
	dbUser: "devel",
	dbPass: "",
	dbTime: "+09:00", // set to japanese time
	
	/* ssl files */
	options: {
		key: fs.readFileSync('./ssl/wildcard.nativecamp.net_2016_unlimited.key'),
		cert: fs.readFileSync('./ssl/gl_wildcard.nativecamp.net_2016.csr'),
		ca: fs.readFileSync('./ssl/gl_wildcard.nativecamp.net_2016.chain')
	},
	
	/* allowed sites */
	origins: ""
};