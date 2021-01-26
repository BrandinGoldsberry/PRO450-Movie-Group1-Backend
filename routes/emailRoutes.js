const nodemailer = require("nodemailer");
const Express = require("express");
const EmailRouter = Express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'group1.stackitup@gmail.com',
      pass: 'Berni3S@nders'
    }
});

const sendEmail = (from, to, subject, text) => {
    transporter.sendMail({ from, to, subject, text }, (err, info) => {
        if (err) console.log(err);
        else console.log(info.response);
    });
};

EmailRouter.post('/reset-password', (req, res) => {
    console.log(req.body);
});

module.exports = EmailRouter;
