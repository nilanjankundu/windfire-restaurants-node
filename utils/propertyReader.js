var propertiesReader = require('properties-reader');
var logger = require('./logger');
// Variables section
var configDir = (process.env.CONFIG_DIR || (process.cwd() + '/config'));
logger.info("Configuration files directory from CONFIG_DIR environment variable = " + configDir);
var properties;
	try {
		properties = propertiesReader(configDir + '/config.properties');
	} catch (error) {
		logger.error("Not able to read from " + configDir + "/config.properties - check whether the file exists");
	}
// Functions
function getProperty(key) {
	return properties.get(key);
}	

exports.getProperty = getProperty;