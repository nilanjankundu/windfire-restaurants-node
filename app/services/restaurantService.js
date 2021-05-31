// ##################################
// ###### Add required modules ######
// ##################################
var logger = require('../utils/logger');
var restaurantDao = require('./restaurantDao');
// #######################
// ###### Functions ######
// #######################
function getRestaurants(callback) {
	logger.info("restaurantService.getRestaurants called");
	restaurantDao.findAll(callback);
}

function addRestaurant(data, callback) {
	logger.info("restaurantService.addRestaurant called");
	restaurantDao.create(data, callback);
}

function deleteRestaurant(id, callback) {
	logger.info("restaurantService.deleteRestaurant called");
	restaurantDao.removeById(id, callback);
}
// ################### Exposed APIs
exports.getRestaurants = getRestaurants;
exports.addRestaurant = addRestaurant;
exports.deleteRestaurant = deleteRestaurant;