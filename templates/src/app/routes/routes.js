var routes = require("require-dir")();

module.exports = function(router) {
     // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        next(); // make sure we go to the next routes and don't stop here
    });
    
    // Loops through DIR and includes routes
    Object.keys(routes).forEach(function(routeName) {
        require('./' + routeName)(router);
    });
}