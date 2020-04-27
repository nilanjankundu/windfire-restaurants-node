module.exports = function(app, logger) {
	app.get('/healthz', function(req, res) {
        logger.info("/healthz endpoint called");
        res.json({ response : 'App is healthy !!!'});
    });
};