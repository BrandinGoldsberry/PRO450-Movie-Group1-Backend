const Review = require("../schema/review");
const User = require("../schema/user");
const Express = require("express");
const bodyParser = require("body-parser");
const UserRouter = Express.Router();
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require('axios');
const { json } = require("express");

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
                            "id": user._id,
                            "admin": user.admin,
                            "superAdmin": user.superAdmin
                        }
                    });
                }

            }
        });
    })
})

UserRouter.post("/login", jsonParser, (req, res) => {
    var username = req.body.username;
    var pass = req.body.password;

    if (!pass & !username) {
        return res.status(400).send("Not all fields are filled out.")
    }

    connectToMongo(() => {
        User.findOne({ username: username }).exec((err, user) => {
            if (err) console.log(err);
            else if (user === null) {
                res.status(400).json({ "error": "User not found" });
            }
            else {
                if (bcrypt.compareSync(pass, user.hashed_password)) {
                    return res.status(200).json({
                        "user": {
                            "username": user.username,
                            "email": user.email,
                            "id": user._id,
                            "admin": user.admin,
                            "superAdmin": user.superAdmin
                        }
                    });
                } else {
                    return res.status(400).send("Password invalid!");
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

// UserRouter.put('/update-user', jsonParser, (req, res) => {
//     let id = req.body.userId;
//     connectToMongo(() => {

//     });
// });

UserRouter.put("/update-user", jsonParser, (req, res) => {
    var newUserInfo = {}
    var id = req.body.userId;
    // id = mongoose.Types.ObjectId(id);
    if(req.body.username) newUserInfo.username = req.body.username;
    if(req.body.password) newUserInfo.hashed_password = bcrypt.hashSync(req.body.password, 10);
    if(req.body.email) newUserInfo.email = req.body.email;
    if(req.body.fname) newUserInfo.fname = req.body.fname;
    if(req.body.lname) newUserInfo.lname = req.body.lname;
    if(req.body.street) newUserInfo.street = req.body.street;
    if(req.body.city) newUserInfo.city = req.body.city;
    if(req.body.state) newUserInfo.state = req.body.state;
    if(req.body.zip_code) newUserInfo.zip_code = req.body.zip_code;
    if(req.body.phone) newUserInfo.phone = req.body.phone;

    console.log(newUserInfo);

    connectToMongo(() => {
        User.updateOne({_id: id}, newUserInfo).exec((err, user) => {
            console.log(user);
            if(user != null) {
                res.status(200).json({"error": "User not found"});
            } else {
                // newUser.password = bcrypt.hash(newUser.pass, 10);
                // userToAdd = new User(newUser);
                // userToAdd.save((err) => {
                //     if (err) console.log(err);
                //     else {
                //         res.status(200).json({"user": userToAdd});
                //     }
                // })
                res.status(200).json({"message": "User Updated!"});
            }
        })
    })
})

UserRouter.delete('/delete-user', jsonParser, (req, res) => {
    let id = req.query.userId;
    connectToMongo(() => {
        User.deleteOne({ _id: id }).exec((err, users) => {
            if (err) console.log(err);
            else {
                // console.log(users);
                Review.deleteMany({ "userId": id }, (err, deleted) => {
                    if (err) console.log(err);
                    else res.status(200).json({ user });
                });
            }
        })
    })
})

UserRouter.put('/update-password', jsonParser, (req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;
    connectToMongo(() => {
        User.updateOne({ _id: userId }, {
            password: bcrypt.hashSync(password, 10)
        }, (err, doc) => {
            if (err) console.log(err);
            else res.status(200).json(doc);
        });
    });
});

UserRouter.get('/find-users-by-username', (req, res) => {
    let searchQuery = new RegExp("^" + req.query.search, 'i');
    console.log(searchQuery);
    connectToMongo(() => {
        //You can use strings to explicitly exclude data
        User.find({username: searchQuery}, "-_hashed_password").exec((err, users) => {
            if (err) console.log(err);
            else {
                //I'm just sending it all
                res.status(200).json({"users": users})
            }
        })
    })
})

UserRouter.get('/make-admin', (req, res) => {
    let userId = req.query.userId;
    connectToMongo(() => {
        User.findOneAndUpdate(
            {_id: userId},
            {admin: true}
        ).exec((err, user) => {
            if (err) console.log(err);
            else {
                res.status(200).json({"user": user})
            }
        })
    })
})

UserRouter.get('/take-admin', (req, res) => {
    let userId = req.query.userId;
    connectToMongo(() => {
        User.findOneAndUpdate(
            {_id: userId},
            {admin: false}
        ).exec((err, user) => {
            if (err) console.log(err);
            else {
                res.status(200).json({"user": user})
            }
        })
    })
})

module.exports = UserRouter;
