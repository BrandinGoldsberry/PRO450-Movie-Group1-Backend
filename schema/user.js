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
        require: true
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
    reset_pass_token: {
        type: String,
        require: false
    },
    login_attempts: {
        type: Number,
        require: true
    },
    admin: Boolean,
    superAdmin: Boolean
}), "users");

module.exports = User;
