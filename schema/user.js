const mongoose = require("mongoose");

const User = mongoose.model('User', mongoose.Schema({
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    street: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    zip_code: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true
    },
    hashed_password: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    admin: Boolean
}), "users");

module.exports = User;