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
    axios.get(
        "https://api.themoviedb.org/3/movie/popular?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&page=1"
    ).then((result) => {
        let MovieList = result.data.results;
        for (let index = 0; index < MovieList.length; index++) {
            const element = MovieList[index];
            element.overview = element.overview.slice(0, 65);
        }
        res.render("index", {MovieList});
    });
})

module.exports = FrontEndRouter;