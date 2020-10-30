// Add required modules
var logger = require('../utils/logger');
var propertyReader = require('../utils/propertyReader');
// Functions
function getRestaurants(callback) {
	logger.info("RestaurantService.getRestaurants called");
	findRestaurants(function(items) {
		callback(items);
	})
	//__getFakeRestaurants(callback);
}

function findRestaurants(callback) {
	var restaurantDao = require('./restaurantDao');
	restaurantDao.findAll(callback);
}

function readRestaurantList(callback) {
	// See https://codeforgeek.com/nodejs-mysql-tutorial/
	var mysql = require('mysql');
	var dbUrl = propertyReader.getProperty('db.url');
	var dbPort = propertyReader.getProperty('db.port');
	var dbUser = propertyReader.getProperty('db.user');
	var dbPassword = propertyReader.getProperty('db.password');
	var dbName = propertyReader.getProperty('db.dbname');
	var dbUser = 'root';
	var sqlQuery = "SELECT * FROM restaurants";
	
	var pool = mysql.createPool({
		connectionLimit : 100,
		host     : dbUrl,
		port	 : dbPort,
		user     : dbUser,
		password : dbPassword,
		database : dbName,
		debug    :  false
	});
	pool.getConnection(function (err, connection) {
		logger.info("Connecting to database url '" + dbUrl + ":" + dbPort + "' with user '" + dbUser + "' ...");
		if (err) {
			logger.info("Error connecting to database url '" + dbUrl + ":" + dbPort + "'");
			logger.info(err);
			callback({"code": 100, "status": "Error in connection to database"});
			return;
		}
		connection.query(sqlQuery, function (err, rows) {
			logger.info("Connected as id " + connection.threadId);
			logger.info("Querying database with '" + sqlQuery + "' ...");
			connection.release();
			if (!err) {
				callback(rows);
				return;
			}
		});
		connection.on('error', function (err) {
			logger.info("Error connecting to database url '" + dbUrl + ":" + dbPort + "'");
			logger.info(err);
			callback({"code": 100, "status": "Error in connection to database"});
			return;
		});
	});
}

function __NEW_readRestaurantList(callback) {
	// See https://dev.mysql.com/doc/dev/connector-nodejs/8.0/tutorial-Connecting_to_a_Server.html
	const mysqlx = require('@mysql/xdevapi');
	var dbUrl = process.env.DB_URL;
	var dbPort = process.env.DB_PORT;
	var dbUser = 'root';
	var sqlQuery = "SELECT * FROM restaurants";
	const config = {
		host: dbUrl,
		port: dbPort,
		user: dbUser,
		password: 'password',
		schema: 'restaurants'
	};

	logger.info("Connecting to database url '" + config.host + ":" + config.port + "' with user '" + config.user + "' ...");

	/*mysqlx.getSession(config).then(session => {
		return session.createSchema('bar').then(() => {
			return session.getSchemas();
		}).then(schemas => {
			logger.info(schemas); // [{ Schema: { name: 'bar' } }]
		});
    });*/

	mysqlx.getSession(config).then(session => {
		logger.info(session.inspect());
	}).catch(err => {
		logger.info(err);
		callback({"code": 100, "status": "Error in connection to database"});
        // should not reach this point for any timeout-related reason
    });
}

function __getFakeRestaurants(callback) {
	var restaurant1 = { id : 1, name : "Hostaria Vecchio Portico", city : "Arona", rating: 4};
	var restaurant2 = { id : 2, name : "Il Ragazzo di Campagna", city : "Gallarate", rating: 4}
	var restaurant3 = { id : 3, name : "Il Cormorano", city : "Milano", rating: 3}
	var restaurant4 = { id : 4, name : "Roadhouse", city : "Varese", rating: 3}
	var restaurant5 = { id : 5, name : "Arancioamaro", city : "Cannero", rating: 3}
	var restaurants = [restaurant1, restaurant2, restaurant3, restaurant4, restaurant5];
	callback({ restaurants : restaurants});
}

exports.getRestaurants = getRestaurants;