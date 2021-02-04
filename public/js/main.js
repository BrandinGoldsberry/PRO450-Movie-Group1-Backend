import {stars} from './stars.js';
import {movieService} from './movieService.js';
import {userService} from './userService.js'
import {passwordService} from './passwordService.js'

const initHeaderButtons = () => {
    let logIn = document.getElementById("loginButton");
    let logInFloat = document.getElementById("loginButtonFloat");
    logIn.addEventListener("click", (e) => {
        location.assign("/login");
    })
    logInFloat.addEventListener("click", (e) => {
        location.assign("/login");
    })

    let signUpButton = document.getElementById("signUpButton");
    signUpButton.addEventListener("click", (e) => {
        location.assign("/signup");
    })
    let signUpButtonFloat = document.getElementById("signUpButtonFloat");
    signUpButtonFloat.addEventListener("click", (e) => {
        location.assign("/signup");
    })

    let editAccountButton = document.getElementById("userPageButton");
    editAccountButton.addEventListener('click', evt => {
        location.assign('/edit');
    });
    let editAccountButtonFloat = document.getElementById("userPageButtonFloat");
    editAccountButtonFloat.addEventListener('click', evt => {
        location.assign('/edit');
    });
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
    let adminButtonFloat = document.getElementById("adminButtonFloat");
    let userPageButtonFloat = document.getElementById("userPageButtonFloat");
    let logOutButtonFloat = document.getElementById("logOutButtonFloat");

    if(Cookies.get("admin") === "true") {
        adminButton.className = "";
        adminButtonFloat.className = "";
    }
    userPageButton.className = "";
    userPageButtonFloat.className = "";

    userPageButton.innerText = Cookies.get("username");
    userPageButtonFloat.innerText = Cookies.get("username");

    logOutButton.className = "";
    logOutButtonFloat.className = "";
    logOutButton.addEventListener("click", logOut);
    logOutButtonFloat.addEventListener("click", logOut);

    let loginButton = document.getElementById("loginButton");
    let loginButtonFloat = document.getElementById("loginButtonFloat");
    let signUpButton = document.getElementById("signUpButton");
    let signUpButtonFloat = document.getElementById("signUpButtonFloat");

    loginButton.className = "disabled";
    loginButtonFloat.className = "disabled";
    signUpButton.className = "disabled";
    signUpButtonFloat.className = "disabled";
}

window.onload = (e) => {
    //Essentially makes all stars blank
    initHeaderButtons();
    stars.initializeStars();
    movieService.getMovieReviews();
    movieService.initializeNewReviews();
    document.getElementById("movieSubmit").addEventListener("click", movieService.search);
    document.getElementById("searchTypeSelect").addEventListener("change", movieService.updateSearchType);
    if (location.href.indexOf("login") > -1) {
        userService.initlogin();
    }
    if (location.href.indexOf("signup") > -1) {
        userService.initSignup();
    }
    if (location.href.indexOf('edit') > -1) {
        userService.initEditAccount();
    }
    if (location.href.indexOf('reset-pass') > -1) {
        passwordService.initResetPass();
    }
    if(validateLogIn()) {
        enableAccountButtons();
    }
}