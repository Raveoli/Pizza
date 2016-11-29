var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user');
var Admin = require('../models/admin');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            //console.log("user.userName"+user)
            done(err,user);
        });
    });
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'userName',
            passwordField : 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ userName: username}, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null,false, req.flash('signupMessage','Username is already taken'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser= new User();
                        // set the user's local credentials
                        newUser.userName    = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.name = req.body.name;
                        newUser.email    = req.body.email;
                        newUser.address    = req.body.address;
                        newUser.phNo    = req.body.phNo;
                        newUser.zipCode    = req.body.zipCode;
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    passport.use(new LocalStrategy({
            usernameField: 'userName',
            passwordField : 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
                User.findOne({ userName: username }, function (err, user) {
                    if (err) { return done(err); }
                    // Return if user not found in database
                    if (!user) {
                        /*return done(null, false, {
                            message: 'User not found'
                        });*/
                        return done(null, false,req.flash('loginMessage','User not found'));
                    }
                    if (!user.validPassword(password)) {
                       /* return done(null, false, {
                            message: 'Password is wrong'
                        });*/
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // If credentials are correct, return the user object
                    return done(null, user);
                });
        }
    ));
}
