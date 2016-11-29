var mongoose = require("mongoose");
var toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: Number
});
module.exports = mongoose.model('Toppings', toppingSchema);