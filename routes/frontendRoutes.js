const Review = require("../schema/review");
const User = require("../schema/user");
const Express = require("express");
const bodyParser = require("body-parser");
const FrontEndRouter = Express.Router();
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require('axios');

FrontEndRouter.get("/", (req, res) => {
    res.render("index", {});
})

module.exports = FrontEndRouter;