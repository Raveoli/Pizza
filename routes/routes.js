var Product = require('../models/products');
//var Order = require('../models/orders');
module.exports = function (app, passport) {
    app.get('/login', function (req, res) {
        res.render('home/login', {message: req.flash('loginMessage')});
    });
    app.get('/signup', function (req, res) {
        res.render('home/signup', {message: req.flash('signupMessage')});
    });
    app.get('/profile', isLoggedIn, function (req, res) {
        console.log("user login");
        if (req.user.userName == 'admin1')
            res.render('home/admin');
        else
            res.render('home/profile', {user: req.user});
        //res.render('home/signup',{ message: req.flash('signupMessage')});
    });
    app.get('/user/orders', isLoggedIn, function (req, res) {
        Order.find({user: req.user._id}, function (err, orders) {
            res.render('home/listOrders', {orders: orders});
        })
    });
    app.get('/user/:id', isLoggedIn, function (req, res) {
        var orderid = req.param("id");
        Order.findById(orderid, function (err, order) {
            console.log(order);
            res.render('home/orderDetails', {order: order});
        })
    });
    app.get('/admin/add', isLoggedIn, function (req, res) {
        res.render('home/addProducts'); // load the index.ejs file
    });
    /* app.get('/admin',isLoggedIn, function (req, res) {
        console.log("admin login");
        res.render('home/admin');
        //res.render('home/signup',{ message: req.flash('signupMessage')});
     });*/
    app.get('/admin/products', isLoggedIn, function (req, res) {
        res.render('home/listadmin');// load the index.ejs file
    });

    app.get('/admin/update/:prodid', isLoggedIn, function (req, res) {
        var prodid = req.param("prodid");
        Product.findById(prodid, function (err, product) {
            console.log("Product found!" + product);
            res.render('home/updateProducts', {product: product});
            //res.render('listProducts.jade', {data: products});
        })
        //res.render('updateProducts.jade'); // load the index.ejs file
    });

    app.get('/admin/delete/:delid', isLoggedIn, function (req, res) {
        var delid = req.param('delid');
        //console.log("delid"+delid);
        Product.findByIdAndRemove(delid, function (err, products) {
            if (err)
                console.log("err" + err);
            res.render('home/listadmin');
            //res.render('listProducts.jade', {data: products});
        })// load the index.ejs file
    });

    app.post('/admin/add', isLoggedIn, function (req, res) {
        var prodnm = req.body.name;
        //console.log("prodnm after submission"+req.body.name);
        Product.findOne({name: prodnm}, function (err, products) {
            var product = new Product();
            product.name = req.body.name;
            product.description = req.body.desc;
            product.image = req.body.image;
            product.available = req.body.avail;
            product.price = req.body.sprice;
            product.save(function (err) {
                if (err) {
                    console.log("Error saving");
                } else {
                    console.log("Saved");
                    res.redirect('/admin/products');
                }

            })

        })  //res.render('updateProducts.jade'); // load the index.ejs file
    });

    app.post('/admin/updateprod/:prodid', isLoggedIn, function (req, res) {
        var prodid = req.param("prodid");
        console.log("prodid after submission" + req.param("prodid"));
        Product.findByIdAndUpdate(prodid, {
            '$set': {
                'name': req.body.name,
                'description': req.body.desc,
                'image': req.body.image,
                'available': req.body.avail,
                'price': req.body.sprice
            }
        }, function (err, products) {
            if (err) {
                console.log("error" + err);
            }
            console.log("Product updated!" + products);
            res.redirect('/admin/products');
            //res.render('updateProducts.jade');
            //res.render('listProducts.jade', {data: products});
        })
        //res.render('updateProducts.jade'); // load the index.ejs file
    });
    app.post('/admin/products', function (req, res) {
        Product.find(function (err, products) {
            res.send(products);
        })        // load the index.ejs file
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
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', isLoggedIn, function (req, res) {
        req.logout();
        res.redirect('/');
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }
};
