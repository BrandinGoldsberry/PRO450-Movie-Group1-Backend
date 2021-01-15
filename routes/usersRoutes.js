const User = require("../schema/review");
const Express = require("express");
const bodyParser = require("body-parser");
const UserRouter = Express.Router();
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");

const connectToMongo = (callback) => {
    mongoose.connect("mongodb+srv://main-app:0lB270dUkf2Yny4V@cluster0.kumhg.mongodb.net/Movies?retryWrites=true&w=majority", (err) => {
        if(err) console.log(err);
        else {
            callback();
        }
    });
}

UserRouter.post("/get-user-by-email", (req, res) => {
    connectToMongo(() => {
        User.findOne({email: req.params.email}).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({"error": "User not found!"});
            } else {
                res.status(200).json({"user": user});
            }
        });
    })
})

UserRouter.post("/login", jsonParser, (req, res) => {
    var pass = req.body.password;
    var username = req.body.username;
    console.log(req.body.username);
    connectToMongo(() => { 
        User.findOne({username: username}).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({"error": "user not found"});
            }
            else {
                res.status(200).json({"user": user.username});
            }
        })
    });
});

module.exports = UserRouter;