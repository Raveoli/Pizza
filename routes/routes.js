module.exports = function (app, passport) {
    app.get('/login', function (req, res) {
        res.render('home/login', {message: req.flash('loginMessage')});
    });
    app.get('/signup', function (req, res) {
        res.render('home/signup', {message: req.flash('signupMessage')});
    });
    app.get('/profile', function (req, res) {
        console.log("user login");
        res.render('home/profile');
        //res.render('home/signup',{ message: req.flash('signupMessage')});
    });
    app.get('/admin', function (req, res) {
        console.log("admin login");
        res.render('home/admin');
        //res.render('home/signup',{ message: req.flash('signupMessage')});
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    /*  app.post('/signup', function (req, res, next) {
     passport.authenticate('local-signup', function (err, user, info) {
     if (err) {
     return next(err);
     }
     if (!user) {
     return res.redirect('home/signup');
     }
     req.logIn(user, function (err) {
     if (err) {
     return next(err);
     }
     //req.flash('success','Success!');
     //return res.redirect('/users/' + user.userName);
     return res.redirect('/success');
     });
     })(req, res, next);
     });*/

    /* app.post('/login', function (req, res, next) {
     passport.authenticate('local', function (err, user, info) {
     if (err) {
     console.log("err" + err);
     return next(err);
     }
     if (!user) {
     console.log("info" + info);
     res.render('/home/index.hbs',{ message: req.flash('loginMessage')});
     }
     req.logIn(user, function (err) {
     if (err) {
     return next(err);
     }
     if(user.userName=='admin1'){
     return res.redirect('/admin');
     }
     //return res.redirect('/profile');
     });
     },{failureFlash:true})(req, res, next);
     });*/
    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), function (req, res, next) {
        if (req.user.userName == 'admin1') {
            return res.redirect('/admin');
        }
        else {
            return res.redirect('/profile');
        }
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }
};
