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

router.get('/getMenu', function (req, res, next) {
  Product.find(function (err, products) {
    res.send(products);
  })
});
module.exports = router;
