// ############################
// ###### Services setup ######
// ############################
var restaurantService = require('../services/restaurantService');

module.exports = function(app, logger) {
    // #############################
    // ###### HTTP GET method ######
    // #############################
    app.get('/restaurants', function (httpRequest, httpResponse) {
        logger.info("GET /restaurants endpoint called");
        logger.info("Calling restaurantService.getRestaurants() ...");
        restaurantService.getRestaurants(function(response) {
            console.log("############# restaurant.js : " + response);
            httpResponse.json(response);
        });
    });
    // ##############################
    // ###### HTTP POST method ######
    // ##############################
    app.post('/restaurants', function (httpRequest, httpResponse) {
        logger.info("POST /restaurants endpoint called");
        logger.info("Calling restaurantService.addRestaurant() ...");
        restaurantService.addRestaurant(httpRequest.body, function(response) {
            console.log("############# restaurant.js : " + response);
            httpResponse.json(response);
        });
    });
};