const Review = require("../schema/review");
const User = require("../schema/user");
const Express = require("express");
const bodyParser = require("body-parser");
const FrontEndRouter = Express.Router();
const jsonParser = bodyParser.json();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require('axios');

const genres = [{
    "id": 28,
    "name": "Action"
},
{
    "id": 12,
    "name": "Adventure"
},
{
    "id": 16,
    "name": "Animation"
},
{
    "id": 35,
    "name": "Comedy"
},
{
    "id": 80,
    "name": "Crime"
},
{
    "id": 99,
    "name": "Documentary"
},
{
    "id": 18,
    "name": "Drama"
},
{
    "id": 10751,
    "name": "Family"
},
{
    "id": 14,
    "name": "Fantasy"
},
{
    "id": 36,
    "name": "History"
},
{
    "id": 27,
    "name": "Horror"
},
{
    "id": 10402,
    "name": "Music"
},
{
    "id": 9648,
    "name": "Mystery"
},
{
    "id": 10749,
    "name": "Romance"
},
{
    "id": 878,
    "name": "Science Fiction"
},
{
    "id": 10770,
    "name": "TV Movie"
},
{
    "id": 53,
    "name": "Thriller"
},
{
    "id": 10752,
    "name": "War"
},
{
    "id": 37,
    "name": "Western"
}]

FrontEndRouter.get("/", (req, res) => {
    axios.get(
        "https://api.themoviedb.org/3/movie/popular?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&page=1"
    ).then((result) => {
        let MovieList = result.data.results;
        for (let index = 0; index < MovieList.length; index++) {
            const element = MovieList[index];
            element.overview = element.overview.slice(0, 65);
        }
        res.render("index", {MovieList, genreList: genres});
    });
})

FrontEndRouter.get("/search", (req, res) => {
    let searchType = req.query.searchType;
    let query = req.query.q;
    let url;
    switch (searchType) {
        case "Title":
            url = `https://api.themoviedb.org/3/search/movie?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&query=${query}%20&page=1&include_adult=false`;
            break;
        case "Actor":
            url = `https://api.themoviedb.org/3/search/person?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&query=${query}%20&page=1&include_adult=false`;
            break;
        case "Genre":       
            url = `https://api.themoviedb.org/3/discover/movie?api_key=8fbd2bfef8820b20b271b1213852fe21&with_genres=${query}`;
            break;
        default:
            res.status(400).send("Not a search Type");
            break;
    }

    axios.get(
        url
    ).then((result) => {
        if(searchType === "Actor") {
            let actorList = result.data.results;
            let MovieList = [];
            for (let index = 0; index < actorList.length; index++) {
                let curActor = actorList[index];
                for (const movie of curActor.known_for) {
                    movie.overview = movie.overview.slice(0, 65);
                    MovieList.push(movie);
                }
            }
            res.render("index", {MovieList, genreList: genres});
        } else {
            let MovieList = result.data.results;
            for (let index = 0; index < MovieList.length; index++) {
                const element = MovieList[index];
                element.overview = element.overview.slice(0, 65);
            }
            res.render("index", {MovieList, genreList: genres});
        }
    });
})

FrontEndRouter.get("/login", (req, res) => {
    res.render("login", {});
})

FrontEndRouter.get("/signup", (req, res) => {
    res.render("signup", {});
})

FrontEndRouter.get("/reset-pass/:token", (req, res) => {
    const token = req.params.token;
    if (token) res.render("reset-pass", { token });
    // else res.render('/');
})

module.exports = FrontEndRouter;