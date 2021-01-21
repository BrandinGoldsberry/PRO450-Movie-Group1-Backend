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
        User.findOne({email: req.query.email}).exec((err, user) => {
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
    connectToMongo(() => {
        User.findOne({ username: username }).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({"error": "User not found"});
            }
            else {
                if(bcrypt.compareSync(pass, user.hashed_password)) {
                    res.status(200).json({
                        "user": {
                            "username": user.username,
                            "email": user.email,
                            "id": user._id
                        }
                    });
                } else {
                    res.status(400).json({"error": "Password invalid!"})
                }
            }
        });
    });
});

UserRouter.post("/sign-up", jsonParser, (req, res) => {
    var newUser = {
        pass: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zip_code,
        email: req.body.email,
        phone: req.body.phone
    }
    connectToMongo(() => {
        User.findOne({email: newUser.email}).exec((err, user) => {
            if(user != null) {
                res.status(400).json({"error": "Email in Use!"});
            } else {
                newUser.password = bcrypt.hash(newUser.pass, 10);
                userToAdd = new User(newUser);
                userToAdd.save((err) => {
                    if (err) console.log(err);
                    else {
                        res.status(200).json({"user": userToAdd});
                    }
                })
            }
        })
    })
});

UserRouter.post("/create-admin", jsonParser, (req, res) => {
    var newUser = {
        pass: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zip_code,
        email: req.body.email,
        phone: req.body.phone,
        admin: true
    }
    connectToMongo(() => {
        User.findOne({email: newUser.email}).exec((err, user) => {
            if(user != null) {
                res.status(400).json({"error": "Email in Use!"});
            } else {
                newUser.password = bcrypt.hash(newUser.pass, 10);
                userToAdd = new User(newUser);
                userToAdd.save((err) => {
                    if (err) console.log(err);
                    else {
                        res.status(200).json({"user": userToAdd});
                    }
                })
            }
        })
    })
});

UserRouter.put("/update-user", jsonParser, (req, res) => {
    var newUserInfo = {}
    var email = req.body.email;
    if(req.body.password) {
        newUserInfo.pass = req.body.password;
    }
    if(req.body.street) {
        newUserInfo.street = req.body.street;
    }
    if(req.body.city) {
        newUserInfo.city = req.body.city;
    }
    if(req.body.state) {
        newUserInfo.state = req.body.state;
    }
    if(req.body.zip_code) {
        newUserInfo.zip_code = req.body.zip_code;
    }
    if(req.body.phone) {
        newUserInfo.phone = req.body.phone;
    }

    connectToMongo(() => {
        User.updateOne({email}, newUserInfo).exec((err, user) => {
            if(user != null) {
                res.status(400).json({"error": "User not found"});
            } else {
                // newUser.password = bcrypt.hash(newUser.pass, 10);
                // userToAdd = new User(newUser);
                // userToAdd.save((err) => {
                //     if (err) console.log(err);
                //     else {
                //         res.status(200).json({"user": userToAdd});
                //     }
                // })
                res.status(200).json({"Message": "User Updated!"});
            }
        })
    })
})

UserRouter.delete("/delete-user", jsonParser, (req, res) => {
    var email = req.body.email;
    connectToMongo(() => {
        User.deleteOne({email}).exec((err, users) => {
            if(err) console.log(err);
            else {
                res.status(200).send({"users": users});
                console.log(users);
            }
        })
    })
})

module.exports = UserRouter;