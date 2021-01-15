const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = mongoose.model('Review', Schema({
    movieId: Number,
    rating: Schema.Types.Decimal128,
    review: String,
    userId: Schema.Types.ObjectId
}), "reviews");

module.exports = Review;