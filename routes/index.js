var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home/index', {title: 'Pizza Express'});
});

router.get('/menu', function (req, res, next) {
    res.render('home/menu', {title: 'Menu - Pizza Express'});

});

router.get('/addToCart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
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
