var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var Cart = require('../models/cart');
var Order = require('../models/order');

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
    Product.find(function (err, products) {
        res.send(products);
    })
});
module.exports = router;
