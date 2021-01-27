const nodemailer = require("nodemailer");

const Express = require("express");
const EmailRouter = Express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

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
    const userId = req.body.userId;
    if (req.body.email) {
        const subject = 'Reset Password';
        const text = `Dear [user]\n\n` +
        'Use the following link to reset your password\n\n' +
        `localhost:3000/reset-password/${userId}`;
        sendEmail(masterEmail, req.body.email, subject, text, (err, info) => {
            if (err) console.log(err);
            else res.send(info.response);
        });
    }
});

module.exports = EmailRouter;
