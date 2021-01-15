const User = require("../schema/user");
const Express = require("express");
const bodyParser = require("body-parser");
const UserRouter = Express.Router();
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    console.log(req.body);
    connectToMongo(() => {
        User.findOne({ username: username }).exec((err, user) => {
            console.log(user);
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({"error": "User not found"});
            }
            else {
                if(bcrypt.compareSync(pass, user.hashed_password)) {
                    res.status(200).json({
                        "user": {
                            "username": user.username,
                            "email": user.email
                        }
                    });
                } else {
                    res.status(400).json({"error": "Password invalid!"})
                }
            }
        });
    });
});

module.exports = UserRouter;