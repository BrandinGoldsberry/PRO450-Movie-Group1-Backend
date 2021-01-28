const express = require("express");
const app = express();
const cors = require("cors");
const axios = require('axios');
const bodyParser = require('body-parser');
const pug = require('pug');

app.set('view engine', 'pug');
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

//import routes that CRUD users
const usersRoutes = require("./routes/usersRoutes.js");
//import routes that CRUD reviews
const reviewsRoutes = require("./routes/reviewsRoutes.js");
//imports routes that serve the front of the website
const frontendRoutes = require("./routes/frontendRoutes.js");
//imports routes that are used to send emails to users
const emailRoutes = require("./routes/emailRoutes");

if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// app.use("/", frontendRoutes);
app.use("/users", usersRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/email", emailRoutes);
app.use("/", frontendRoutes);
app.use("/static/js", express.static('static/js'));
app.use("/static/css", express.static('static/css'));

app.listen(process.env.PORT || 5001);