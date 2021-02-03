import {stars} from './stars.js';
import {movieService} from './movieService.js';
import {userService} from './userService.js'

const initHeaderButtons = () => {
    let logIn = document.getElementById("loginButton");
    logIn.addEventListener("click", (e) => {
        location.assign("/login");
    })
    let signUpButton = document.getElementById("signUpButton");
    signUpButton.addEventListener("click", (e) => {
        location.assign("/signup");
    })
}

const validateLogIn = () => {
    return Cookies.get("username") &&
    Cookies.get("admin") &&
    Cookies.get("id") &&
    Cookies.get("superadmin") &&
    Cookies.get("email");
}

const logOut = () => {
    Cookies.remove("username");
    Cookies.remove("admin");
    Cookies.remove("id");
    Cookies.remove("superadmin");
    Cookies.remove("email");
    location.replace("/");
}

const enableAccountButtons = () => {
    let adminButton = document.getElementById("adminButton");
    let userPageButton = document.getElementById("userPageButton");
    let logOutButton = document.getElementById("logOutButton");

    if(Cookies.get("admin") === "true") {
        adminButton.className = "";
    }
    userPageButton.className = "";
    userPageButton.innerText = Cookies.get("username");
    logOutButton.className = "";
    logOutButton.addEventListener("click", logOut);

    let loginButton = document.getElementById("loginButton");
    let signUpButton = document.getElementById("signUpButton");

    loginButton.className = "disabled";
    signUpButton.className = "disabled";
}

window.onload = (e) => {
    //Essentially makes all stars blank
    initHeaderButtons();
    stars.initializeStars();
    movieService.getMovieReviews();
    movieService.initializeNewReviews();
    document.getElementById("movieSubmit").addEventListener("click", movieService.search);
    if(location.href.indexOf("login") > -1) {
        userService.initlogin();
    }
    if(location.href.indexOf("signup") > -1) {
        userService.initSignup();
    }
    if(validateLogIn()) {
        enableAccountButtons();
    }
}