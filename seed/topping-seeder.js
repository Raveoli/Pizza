var Topping = require('../models/toppings');

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/pizzaExpress');

var toppings = [
    new Topping({
        name: "Onions",
        price: 1

    }),
    new Topping({
        name: "Tomatoes",
        price: 1

    }),
    new Topping({
        name: "Jalapenos",
        price: 1

    }),
    new Topping({
        name: "Extra Cheese",
        price: 2

    }),
    new Topping({
        name: "Olives",
        price: 1

    }),
    new Topping({
        name: "Peppers",
        price: 1

    }),
    new Topping({
        name: "Mushrooms",
        price: 1

    }),
    new Topping({
        name: "Pepperoni",
        price: 2

    }),
    new Topping({
        name: "Pineapple",
        price: 1

    }),
    new Topping({
        name: "Sausage",
        price: 2

    })
];

var done = 0;
for (var i = 0; i < toppings.length; i++) {
    toppings[i].save(function (err, result) {
        done++;
        if (done === toppings.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
