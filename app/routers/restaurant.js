// Services setup
var restaurantService = require('../services/restaurantService');

module.exports = function(app, logger) {
    app.get('/restaurants', function (req, res) {
        logger.info("/restaurants endpoint called");
        logger.info("Calling restaurantService.getRestaurants() ...");
        restaurantService.getRestaurants(function(response) {
            res.json(response);
        });
    });
};