// Add required modules
var express = require('express');
var cors = require('cors');
var connectTimeout = require('connect-timeout');
var logger = require('./utils/logger');
// Variable declaration
const configuration = require('./utils/configuration');
const timeout = process.env.TIMEOUT || configuration.getProperty('timeout');
// Initialize application
var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(process.cwd() + '/public'));
app.use(errorHandler);
//app.use(connectTimeout(timeout));
//app.use(haltOnTimedout);
// Variables section
var PORT = process.env.EXPOSED_PORT || 8082;
// Routers setup
require("./routers/health")(app, logger);
require("./routers/restaurant")(app, logger);
// Run server
app.listen(PORT, function() {
	logger.info("Current working directory = " + process.cwd());
	logger.info("Application is listening on port " + PORT);
});
// ############ Common Functions
process.on('uncaughtException', error => {
	logger.error('There was an uncaught error : ', error);
	//process.exit(1) //mandatory (as per the Node.js docs)
})
// Halt timeout
function haltOnTimedout(req, res, next){
	if (!req.timedout) {
		next();
	}
}
// Error Handling
function errorHandler (err, req, res, next) {
	logger.error("errorHandler - " + err);
	if (res.headersSent) {
	  return next(err)
	}
	res.status(500);
	//res.render('error.html', { error: err });
	res.sendFile('error.html', {root : process.cwd() + '/public'});
}