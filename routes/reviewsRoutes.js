const Review = require("../schema/review");
const Express = require("express");
const bodyParser = require("body-parser");
const ReviewRouter = Express.Router();
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const { ObjectID } = require("bson");

const connectToMongo = (callback) => {
    mongoose.connect("mongodb+srv://main-app:0lB270dUkf2Yny4V@cluster0.kumhg.mongodb.net/Movies?retryWrites=true&w=majority", (err) => {
        if(err) console.log(err);
        else {
            callback();
        }
    });
}

//Get Review
ReviewRouter.get("/get-review", (req, res) => {
    connectToMongo(() => {
        Review.findOne({_id: req.body.id}).exec((err, review) => {
            if(err) console.log(err);
            else {
                res.statusCode = 200;
                res.json({"result": review});
            }
        });
    });
});

//Add Review
ReviewRouter.post("/post-review", jsonParser, (req, res) => {
    var user = req.body.user;
    var reviewText = req.body.reviewText;
    var rating = req.body.rating;
    var movieId = req.body.movieId;
    connectToMongo(() => {
        let newReview = new Review({
            movieId: movieId,
            rating: rating,
            review: reviewText,
            userId: new ObjectID(user)
        });
        newReview.save((err) => {
            if(err) console.log(err);
            else {
                res.status(200).send("Review submitted!");
            }
        });
    });
});

//Update Review
ReviewRouter.put("/update-review", jsonParser, (req, res) => {
    var reviewId = req.body.reviewId;
    var reviewText = req.body.bodyText;
    var rating = req.body.rating;
    var newVals = {
        bodyText: req.body.bodyText,
        rating: req.body.rating
    }
    connectToMongo(() => {
        Review.updateOne({_id: reviewId}, newVals).exec((err, review) => {
            if(err) console.log(err);
            else {
                res.status(200).send("Review submitted!");            }
        });
    });
});

//Delete Review
ReviewRouter.delete("/delete-review", jsonParser, (req, res) => {
    
});

module.exports = ReviewRouter;