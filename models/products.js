var mongoose = require("mongoose");
var topping = require('../models/toppings');
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    price: Number
});
productSchema.index({name: 'text', description: 'text'});
module.exports = mongoose.model('Product', productSchema);