var User = require('../models/user');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var routes = require("require-dir")();

module.exports = function(router) {
    
    router.route('/authenticate')
        .post(function(req, res) { 
            User.findOne({
               email: req.body.email 
            }, {'password':1, 'name': 1, 'email': 1}, function(err, user) {
                if (err)
                    return res.status(500).send(err);
                    
                if (!user) {
                    res.status(400).json({message: 'user not found'});
                } else if (user) {
                    bcrypt.compare(req.body.password, user.password, function(err, response) {
                        if (err)
                            return res.status(500).send(err);

                        if (response) {
                            var token = jwt.sign(user, process.env.SECRET, {
                                expiresIn: 86400
                            });
                            
                            var cleanUser = user.toObject();
                            delete cleanUser['password'];
                            
                            res.status(200).json({message: 'Authentication successful', token: token, user: cleanUser});
                        } else {
                            return res.status(400).json({message: 'password incorrect'});
                        }
                    });
                    
                }
            });
        });
    
    router.route('/users')
        .post(function(req, res) {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            
            User.findOne({email: user.email}, function(err, data){
                if (err)
                    return res.status(500).send(err);
                
                if (data) {
                    res.status(409).json({message: 'Email Already Exists'});
                } else {
                    bcrypt.hash(req.body.password, 10, function(err, hash) {
                        if (err)
                            return res.status(500).send(err);

                        user.password = hash;

                        user.save(function(err) {
                            if (err)
                                return res.status(500).send(err);
                            
                            // Change use to an object, so I can remove the password, so it isn't sent back with the JSON object.
                            var newUser = user.toObject();
                            delete newUser["password"];
                            
                            res.json(newUser);
                        });
                    });
                }
            });

            
        });
    
    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging

        var token = req.params.token || req.headers.authorization;
        if (token) {
                
                var bearer = token.split(" ");
                var bearerToken = bearer[1];

                jwt.verify(bearerToken, process.env.SECRET, function(err, decoded) {
                    if (err)
                        return res.status(403).json({message: 'Failed to authenticate token'});
                    
                    req.decoded = decoded;
                    next(); // make sure we go to the next routes and don't stop here
                });
        } else {
            res.status(403).send({
                message: 'No token provided'
            });
        };
    });
    
    // Loops through DIR and includes routes
    Object.keys(routes).forEach(function(routeName) {
        require('./' + routeName)(router);
    });
}