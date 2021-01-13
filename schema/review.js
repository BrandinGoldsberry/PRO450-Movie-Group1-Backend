import { Double } from 'bson';
import mongoose, { Schema } from 'mongoose';

const Review = mongoose.model('reviews', mongoose.Schema({
    movieId: Number,
    rating: Schema.Types.Decimal128,
    review: String,
    userId: Schema.Types.ObjectId
}));

export default Review;