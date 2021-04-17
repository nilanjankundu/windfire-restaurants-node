// ##################################
// ###### Add required modules ######
// ##################################
var logger = require('../utils/logger');
var restaurantDao = require('./restaurantDao');
// #######################
// ###### Functions ######
// #######################
function getRestaurants(callback) {
	logger.info("RestaurantService.getRestaurants called");
	restaurantDao.findAll(callback);
}

function addRestaurant(data, callback) {
	logger.info("RestaurantService.addRestaurant called");
	restaurantDao.create(data, callback);
}

function deleteRestaurant(id, callback) {
	logger.info("RestaurantService.addRestaurant called");
	restaurantDao.removeById(id, callback);
}
// ################### Exposed APIs
exports.getRestaurants = getRestaurants;
exports.addRestaurant = addRestaurant;
exports.deleteRestaurant = deleteRestaurant;