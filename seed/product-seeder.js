var Product = require('../models/products');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/pizzaExpress');

var products = [
    new Product({
        name: "Cheese Pizza",
        description: "Real cheese made from mozzarella and pizza sauce.",
        image: "/images/cheese.jpg",
        available: true,
        price: 7

    }),
    new Product({
        name: "Sausage",
        description: "Sausage and real cheese made from mozzarella.",
        image: "/images/sausage.jpg",
        available: true,
        price: 8

    }),
    new Product({
        name: "BBQ Chicken",
        description: "BBQ sauce topped with all-white chicken, bacon and onions.",
        image: "/images/bbqChicken.jpg",
        available: true,
        price: 9

    }),
    new Product({
        name: "Garden Fresh",
        description: "Green peppers, onions, mushrooms, black olives and Roma tomatoes",
        image: "/images/gardenFresh.jpg",
        available: true,
        price: 8

    }),
    new Product({
        name: "Spinach Alfredo",
        description: "Spinach and a rich, creamy garlic Parmesan Alfredo sauce.",
        image: "/images/spinachAlfredo.jpg",
        available: true,
        price: 8

    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}