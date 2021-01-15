import mongoose from 'mongoose';

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
    username: String
}), "users");

export default User;