const Review = require("../schema/review");
const User = require("../schema/user");
const Express = require("express");
const ReviewRouter = Express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");

const connectToMongo = (callback) => {
    mongoose.connect("mongodb+srv://main-app:0lB270dUkf2Yny4V@cluster0.kumhg.mongodb.net/Movies?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if(err) console.log(err);
        else {
            callback();
        }
    });
}

//Get Review
ReviewRouter.get("/get-review", (req, res) => {
    connectToMongo(() => {
        Review.findOne({_id: req.query.id}).exec((err, review) => {
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
    // console.log(req.body);
    var email = req.body.email;
    var reviewText = req.body.reviewText;
    var rating = req.body.rating;
    var movieId = req.body.movieId;
    var username = req.body.username
    // console.log(email);
    connectToMongo(() => {
        User.findOne({ email }).exec((err, user) => {
            // console.log(user);
            let newReview = new Review({
                movieId: movieId,
                rating: rating,
                review: reviewText,
                userId: user._id,
                username
            });
            newReview.save((err) => {
                if(err) console.log(err);
                else {
                    res.status(200).send("Review submitted!");
                }
            });
        });
    });
});

//Update Review
ReviewRouter.put("/update-review", jsonParser, (req, res) => {
    var reviewId = req.body.reviewId;
    var review = req.body.reviewText;
    var rating = req.body.rating;
    var newVals = {
        review,
        rating
    }
    // console.log(req.body);
    connectToMongo(() => {
        Review.updateOne({_id: reviewId}, newVals).exec((err, review) => {
            if (err) console.log(err);
            else res.status(200).send("Review submitted!");
        });
    });
});

//Delete Review
ReviewRouter.delete("/delete-review", jsonParser, (req, res) => {
    var reviewId = req.query.reviewId;
    // console.log(req.query);
    connectToMongo(() => {
        Review.deleteOne({_id: reviewId}).exec((err, review) => {
            if (err) console.log(err);
            else res.status(200).send("Review Deleted!");
        });
    });
});

ReviewRouter.get("/user-reviewed-movie", (req, res) => {
    var movieId = req.query.movieId;
    var userId = req.query.userId;
    connectToMongo(() => {
        Review.find({movieId, userId}).exec((err, reviews) => {
            if (err) console.log(err);
            else if (reviews === null || reviews === undefined || reviews.length < 1) {
                res.status(200).json({"reviews": []});
            } else {
                res.status(200).json({"reviews": reviews});
            }
        })
    })
})

ReviewRouter.get("/reviews-by-movie", (req, res) => {
    var movieId = req.query.movieId;
    connectToMongo(() => {
        Review.find({movieId}).exec((err, reviews) => {
            if (err) console.log(err);
            else if (reviews === null || reviews === undefined || reviews.length < 1) {
                res.status(200).json({"error": "No reviews for movie"});
            } else {
                res.status(200).json({"reviews": reviews});
            }
        })
    })
})


ReviewRouter.get("/get-reviews-by-user", (req, res) => {
    var userId = req.query.userId;
    connectToMongo(() => {
        Review.find({userId}).exec((err, result) => {
            if (err) console.log(err);
            if(result !== null && result !== undefined && result.length !== 0) {
                res.status(200).json({"result": result})
            }else{
                {result}
            }
        })
    })
})

ReviewRouter.get("/reviews-by-movie", (req, res) => {
    var movieId = req.query.movieId;
    connectToMongo(() => {
        Review.find({movieId}).exec((err, reviews) => {
            if (err) console.log(err);
            else if (reviews === null || reviews === undefined || reviews.length < 1) {
                res.status(200).json({"error": "No reviews for movie"});
            } else {
                res.status(200).json({"reviews": reviews});

            }
        })
    })
})

ReviewRouter.post("/remove-reviews-by-user", jsonParser, (req, res) => {
    var userId = req.body.userId;
    connectToMongo(() => {
        Review.deleteMany({userId}).exec((err, result) => {
            if (err) console.log(err);
            else if(result !== null && result !== undefined && result.length !== 0) {
                res.status(200).json({"result": result})
            } else {
                res.status(406).json({"error": "no results deleted"})
            }
        })
    })
})

module.exports = ReviewRouter;

