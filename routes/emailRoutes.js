const nodemailer = require("nodemailer");

const Express = require("express");
const EmailRouter = Express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const uuid = require('uuid');

const User = require("../schema/user");
const mongoose = require("mongoose");

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

const masterEmail = 'group1.stackitup@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'group1.stackitup@gmail.com',
      pass: 'Berni3S@nders'
    }
});

const sendEmail = (from, to, subject, text, callback) => {
    transporter.sendMail({ from, to, subject, text }, callback);
};

EmailRouter.post('/reset-password', jsonParser, (req, res) => {
    connectToMongo(() => {
        const email = req.body.email;
        const userId = req.body.userId;
        let query = userId? { _id: userId } : email? { email } : null;
        if (query) {
            User.findOne(query, (err, user) => {
                if (err) console.log(err);
                else if (user) {
                    let token = uuid.v4();
                    user.reset_pass_token = token;
                    user.save();
                    console.log(token);
                    
                    const subject = 'Reset Password';
                    const text = `Dear ${user.fname} ${user.lname}\n\n` +
                    'Use the following link to reset your password\n\n' +
                    `http://localhost:5001/reset-pass/${user.reset_pass_token}`;
                    // `http://localhost:3000/reset-password/${user.reset_pass_token}`;
                    sendEmail(masterEmail, user.email, subject, text, (err, info) => {
                        if (err) console.log(err);
                        else res.send(true);
                    });
                } else res.send(false);
            });
        }
    });
});

module.exports = EmailRouter;
