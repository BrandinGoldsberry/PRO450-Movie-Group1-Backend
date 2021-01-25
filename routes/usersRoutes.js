const User = require("../schema/user");
const Express = require("express");
const bodyParser = require("body-parser");
const UserRouter = Express.Router();
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require('axios');

const connectToMongo = (callback) => {
    mongoose.connect("mongodb+srv://main-app:0lB270dUkf2Yny4V@cluster0.kumhg.mongodb.net/Movies?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) console.log(err);
        else {
            callback();
        }
    });
}

UserRouter.post("/get-user-by-email", (req, res) => {
    connectToMongo(() => {
        User.findOne({ email: req.query.email }).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({ "error": "User not found!" });
            } else {
                res.status(200).json({ "user": user });
            }
        });
    })
})

//Insecure? Yes? Does it matter? No
UserRouter.post("/get-user-by-id", (req, res) => {
    connectToMongo(() => {
        User.findOne({ _id: req.query.userId }).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({ "error": "User not found!" });
            } else {
                res.status(200).json({ "user": user });
            }
        });
    })
})

UserRouter.post("/isUserIdValid", (req, res) => {
    const type = req.query.type

    connectToMongo(() => {
        User.findOne({ _id: req.query.userId }).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                if (type === "bool") {
                    return res.send(false);
                }
            } else {
                if (type === "bool") {
                    return res.send(true);
                } else if (type === "name") {
                    return res.send(user.username)
                } else if (type === "loginUserData") {
                    return res.json({
                        "user": {
                            "username": user.username,
                            "email": user.email,
                            "id": user._id
                        }
                    });
                }

            }
        });
    })
})

UserRouter.post("/login", jsonParser, (req, res) => {
    // console.log(req.body.username)

    var pass = req.body.password;
    var username = req.body.username;
    connectToMongo(() => {
        User.findOne({ username: username }).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({ "error": "User not found" });
            }
            else {
                if (bcrypt.compareSync(pass, user.hashed_password)) {
                    res.status(200).json({
                        "user": {
                            "username": user.username,
                            "email": user.email,
                            "id": user._id
                        }
                    });
                } else {
                    res.status(400).json({ "error": "Password invalid!" })
                }
            }
        });
    });
});

UserRouter.post("/sign-up", jsonParser, async (req, res) => {
    const captchaToken = req.body.captchaToken;
    const secret = "6LfU2zoaAAAAAHTZiEPfqbuOO44rWeaxDoOpR_AM";


    const results = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`)
        .catch(error => {
            console.error(error)
        })

    var isHuman = results.data.success;

    if (isHuman) {
        if (!req.body.fname, !req.body.lname, !req.body.street, !req.body.city, !req.body.state, !req.body.state, !req.body.zip_code, !req.body.email, !req.body.email, !req.body.phone, !req.body.password) {
            return res.status(400).send("Not all fields have been filled out.");
        }

        if (!req.body.username) {
            return res.status(500).send("Username is invalid.");
        }

        if (!(req.body.email).match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
            // console.log("Email must follow the correct format. example@email.com");
            return res.status(400).send("Email must follow the correct format. example@email.com");
        }

        if ((req.body.password).length < 6) {
            return res.status(400).send("Password needs to be at least 6 characters long.");
        }

        var newUser = {
            fname: req.body.fname,
            lname: req.body.lname,
            username: req.body.username,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            email: req.body.email,
            phone: req.body.phone,
            hashed_password: await bcrypt.hash(req.body.password, 10),
            admin: false
        }

        connectToMongo(() => {
            User.countDocuments({ email: newUser.email }).exec((err, userCount) => {
                if (userCount == 0) {
                    User.findOne({ email: newUser.email }).exec((err, user) => {
                        if (user != null) {
                            res.status(400).json({ "error": "Email in Use!" });
                        } else {
                            userToAdd = new User(newUser);
                            userToAdd.save((err) => {
                                if (err) console.log(err);
                                else {
                                    res.status(200).json({ "user": userToAdd });
                                }
                            })
                        }
                    })
                } else {
                    return res.status(400).send("Email has been used before.");
                }
            });
        })
    } else {
        return res.status(401).send("Captcha Error: Unauthorized")
    }
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
        User.findOne({ email: newUser.email }).exec((err, user) => {
            if (user != null) {
                res.status(400).json({ "error": "Email in Use!" });
            } else {
                newUser.password = bcrypt.hash(newUser.pass, 10);
                userToAdd = new User(newUser);
                userToAdd.save((err) => {
                    if (err) console.log(err);
                    else {
                        res.status(200).json({ "user": userToAdd });
                    }
                })
            }
        })
    })
});

UserRouter.put("/update-user", jsonParser, (req, res) => {
    var newUserInfo = {}
    var email = req.body.email;
    if (req.body.password) {
        newUserInfo.pass = req.body.password;
    }
    if (req.body.street) {
        newUserInfo.street = req.body.street;
    }
    if (req.body.city) {
        newUserInfo.city = req.body.city;
    }
    if (req.body.state) {
        newUserInfo.state = req.body.state;
    }
    if (req.body.zip_code) {
        newUserInfo.zip_code = req.body.zip_code;
    }
    if (req.body.phone) {
        newUserInfo.phone = req.body.phone;
    }

    connectToMongo(() => {
        User.updateOne({ email }, newUserInfo).exec((err, user) => {
            if (user != null) {
                res.status(400).json({ "error": "User not found" });
            } else {
                // newUser.password = bcrypt.hash(newUser.pass, 10);
                // userToAdd = new User(newUser);
                // userToAdd.save((err) => {
                //     if (err) console.log(err);
                //     else {
                //         res.status(200).json({"user": userToAdd});
                //     }
                // })
                res.status(200).json({ "Message": "User Updated!" });
            }
        })
    })
})

UserRouter.delete("/delete-user", jsonParser, (req, res) => {
    var email = req.body.email;
    connectToMongo(() => {
        User.deleteOne({ email }).exec((err, users) => {
            if (err) console.log(err);
            else {
                res.status(200).send({ "users": users });
                // console.log(users);
            }
        })
    })
})

module.exports = UserRouter;