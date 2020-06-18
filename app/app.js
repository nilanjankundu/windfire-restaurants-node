// Add required modules
var express = require('express');
var cors = require('cors');
var timeout = require('connect-timeout');
var logger = require('./utils/logger');
// Initialize application
var app = express();
app.use(cors());
app.use(express.static(process.cwd() + '/public'));
app.use(errorHandler);
app.use(timeout(5000));
app.use(haltOnTimedout);
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
// Halt timeout
function haltOnTimedout(req, res, next){
	if (!req.timedout) next();
}
// Error Handling
function errorHandler (err, req, res, next) {
	if (res.headersSent) {
	  return next(err)
	}
	logger.error("Error : " + err);
	res.status(500);
	//res.render('error.html', { error: err });
	res.sendFile('error.html', {root : process.cwd() + '/public'});
}