// ############################
// ###### Services setup ######
// ############################
var restaurantService = require('../services/restaurantService');

module.exports = function(app, logger) {
    // #############################
    // ###### HTTP GET method ######
    // #############################
    app.get('/restaurants', function (req, res) {
        logger.info("GET /restaurants endpoint called");
        logger.info("Calling restaurantService.getRestaurants() ...");
        restaurantService.getRestaurants(function(response) {
            console.log("############# restaurant.js : " + response);
            res.json(response);
        });
    });
    // ##############################
    // ###### HTTP POST method ######
    // ##############################
    app.post('/restaurants', function (req, res) {
        logger.info("POST /restaurants endpoint called");
        logger.info("Calling restaurantService.addRestaurant() ...");
        restaurantService.addRestaurant(function(response) {
            console.log("############# restaurant.js : " + response);
            res.json(response);
        });
    });
};