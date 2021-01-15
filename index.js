const express = require("express");
const app = express();
const cors = require("cors");
const axios = require('axios');
app.use(cors());

//import routes that CRUD users
const usersRoutes = require("./routes/usersRoutes.js");
//import routes that CRUD reviews
const reviewsRoutes = require("./routes/reviewsRoutes");
//imports routes that serve the front of the website
const frontendRoutes = require("./routes/frontendRoutes.js");

if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// app.use("/", frontendRoutes);
app.use("/users", usersRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/static/js", express.static('static/js'));
app.use("/static/css", express.static('static/css'));

app.listen(process.env.PORT || 5001);