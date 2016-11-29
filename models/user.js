var mongoose = require("mongoose");
var crypto = require('crypto');
var bcrypt = require("bcrypt-nodejs");
//var jwt = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phNo: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/*userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        userName: this.userName,
        name: this.name,
        email: this.email,
        address: this.address,
        phNo: this.phNo,
        zipCode: this.zipCode,
    });
};*/
module.exports = mongoose.model('User', userSchema);
