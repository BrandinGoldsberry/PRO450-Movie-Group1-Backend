const mongoose = require("mongoose");

const User = mongoose.model('User', mongoose.Schema({
    fname: String,
    lname: String,
    street: String,
    city: String,
    state: String,
    zip_code: String,
    email: String,
    phone: String,
    hashed_password: String,
    username: String,
    admin: Boolean
}), "users");

module.exports = User;