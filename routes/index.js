var express = require('express');
var moment = require('moment-timezone');
var router = express.Router();
var Product = require('../models/products');
var Cart = require('../models/cart');
var Order = require('../models/order');
var User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home/index', {title: 'Pizza Express'});
});

router.get('/menu', function (req, res, next) {
    res.render('home/menu', {title: 'Menu - Pizza Express'});

});

router.get('/checkOut', function (req, res, next) {
    res.render('home/delivery', {title: 'Delivery Method - Pizza Express'});
});

router.get('/guestCheckOut', function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    var cart = new Cart(req.session.cart);
    var order = new Order({
        user: null,
        cart: cart,
        address: "Store-Pickup",
        timeStamp: moment().tz("America/Chicago").format("YYYY-MM-DD HH:mm:ss")

    });
    order.save(function (err) {
        if (err) {
            console.log("Error Saving " + err);
        }
        else {
            req.session.cart = null;
            res.render('home/checkOut', {title: 'Delivery Method - Pizza Express', order: order});
        }
    });

});

router.get('/storePickUp', function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    if (req.isAuthenticated()) {
        var cart = new Cart(req.session.cart);
        var order = new Order({
            user: req.user,
            cart: cart,
            address: "Store-Pickup",
            timeStamp: moment().tz("America/Chicago").format("YYYY-MM-DD HH:mm:ss")

        });
        order.save(function (err) {
            if (err) {
                console.log("Error Saving " + err);
            }
            else {
                req.session.cart = null;
                res.render('home/checkOut', {title: 'Delivery Method - Pizza Express', order: order});
            }
        });

    } else {
        res.render('home/guest', {title: 'Delivery Method - Pizza Express', order: order});
    }


});

router.get('/homeDelivery', function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    if (req.isAuthenticated()) {
        res.render('home/confirmDeliveryAddress', {title: 'Delivery Address - Pizza Express', user: req.user});
    } else {
        res.render('home/guestCheckout', {title: 'Delivery Method - Pizza Express'});
    }


});

router.get('/guestSignUp', function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    res.render('home/deliveryAddress', {title: 'Delivery Method - Pizza Express'});

});
router.post('/hdCheckOut', function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    if (req.isAuthenticated()) {
        var cart = new Cart(req.session.cart);
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address + ", " + req.body.zipCode,
            timeStamp: moment().tz("America/Chicago").format("YYYY-MM-DD HH:mm:ss")

        });
        order.save(function (err) {
            if (err) {
                console.log("Error Saving " + err);
            }
            else {
                req.session.cart = null;
                res.render('home/checkOut', {title: 'Delivery Method - Pizza Express', order: order});
            }
        });

    } else {
        var cart1 = new Cart(req.session.cart);
        var order1 = new Order({
            user: null,
            cart: cart1,
            address: req.body.address + ", " + req.body.zipCode,
            timeStamp: moment().tz("America/Chicago").format("YYYY-MM-DD HH:mm:ss")

        });
        order1.save(function (err) {
            if (err) {
                console.log("Error Saving " + err);
            }
            else {
                req.session.cart = null;
                res.render('home/checkOut', {title: 'Delivery Method - Pizza Express', order: order1});
            }
        });


    }


});

router.get('/shoppingCart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('home/shoppingCart', {products: null});
        console.log("No cart found")
    }
    var cart = new Cart(req.session.cart);
    res.render('home/shoppingCart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.post('/addToCart/:id', function (req, res, next) {
    var productId = req.params.id;
    var quantity = req.body.qty;
    //console.log("Quantity = "+ quantity);
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id, quantity);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/order/:id', function (req, res, next) {
    var productId = req.params.id;
    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        console.log(product)
        res.render('home/order', {title: 'Place Order - Pizza Express', product: product});

    });


});

router.get('/getMenu', function (req, res, next) {
    Product.find({available: true}, function (err, products) {
        res.send(products);
    })
});

router.post('/search', function (req, res) {
    Product.find({$text: {$search: req.body.query}}, {score: {$meta: "textScore"}})
        .sort({score: {$meta: 'textScore'}})
        .exec(function (err, products) {
            if (err) {
                console.log("Error Searching " + err);
            }
            else {
                // console.log(products);
                res.render('home/searchResults', {
                    title: 'Search Results - Pizza Express',
                    products: products,
                    query: req.body.query
                });
            }
        });
});

router.post('/filter/:query', function (req, res) {
    if (req.body.filter == "name") {
        console.log(req.params.query);
        Product.find({name: new RegExp(req.params.query, 'i')}, function (err, products) {
            if (err) throw err;

            // object of the user
            console.log(products);
            res.render('home/searchResults', {
                title: 'Search Results - Pizza Express',
                products: products,
                query: req.params.query
            });

        });
    } else {
        Product.find({description: new RegExp(req.params.query, 'i')}, function (err, products) {
            if (err) throw err;

            // object of the user
            console.log(products);
            res.render('home/searchResults', {
                title: 'Search Results - Pizza Express',
                products: products,
                query: req.params.query
            });
        });
    }
});
module.exports = router;
