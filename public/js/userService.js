const login = (username, password) => {
    axios.post(
        "http://localhost:5001/users/login",
        { username, password }
    ).then(res => {
        console.log(res);
        Cookies.set("username", res.data.user.username);
        Cookies.set("admin", res.data.user.admin);
        Cookies.set("id", res.data.user.id);
        Cookies.set("superadmin", res.data.user.superAdmin);
        Cookies.set("email", res.data.user.email);
        location.assign("/");
    }).catch(
        (err) => {
            console.log(err.response.data);
            document.getElementById("loginError").innerText = err.response.data.error;
        }
    )
}

const initlogin = () => {
    let loginForm = document.getElementById("logInForm");
    loginForm.addEventListener("submit", ev => {
        ev.preventDefault();
        login(ev.target[0].value, ev.target[1].value);
    })
}

const signup = (captchaToken) => {
    let fname = document.getElementById("registerFName").value;
    let lname = document.getElementById("registerLName").value;
    let email = document.getElementById("registerEmail").value;
    let state = document.getElementById("registerState").value;
    let street = document.getElementById("registerStreet").value;
    let city = document.getElementById("registerCity").value;
    let zipcode = document.getElementById("registerZipCode").value;
    let phone = document.getElementById("registerPhone").value;
    let password = document.getElementById("registerPassword").value;

    let errorMsg = document.getElementById("signupError");

    if(!fname) {
        errorMsg.innerText = "Please enter a valid name";
    } else if(!lname) {
        errorMsg.innerText = "Please enter a valid name";
    } else if(!email) {
        errorMsg.innerText = "Please enter a valid email";
    } else if(!state) {
        errorMsg.innerText = "Please enter a valid state";
    } else if(!street) {
        errorMsg.innerText = "Please enter a valid Street";
    } else if(!city) {
        errorMsg.innerText = "Please enter a valid city";
    } else if(!zipcode) {
        errorMsg.innerText = "Please enter a valid zip code";
    } else if(!phone) {
        errorMsg.innerText = "Please enter a valid phone number";
    } else if(!password) {
        errorMsg.innerText = "Please enter a valid password";
    } else {
        axios.post(
            "http://localhost:5001/users/sign-up",
            {
                fname,
                lname,
                password,
                username: `${fname}${lname.charAt(0)}`,
                street,
                city,
                state,
                zipcode,
                email,
                phone,
                captchaToken
            }
        ).then(res => {
            Cookies.set("username", res.data.user.username);
            Cookies.set("admin", res.data.user.admin);
            Cookies.set("id", res.data.user.id);
            Cookies.set("superadmin", res.data.user.superAdmin);
            Cookies.set("email", res.data.user.email);
            location.assign("/");
        }).catch(
            (err) => {
                console.log(err.response.data);
                errorMsg.innerText = err.response.data;
            }
        )
    }
}

const initSignup = () => {
    const onSignupCaptchaCompleted = (e) => {
        console.log(e);
        // signup(e);
    }
    window.onSignupCaptchaCompleted = onSignupCaptchaCompleted;
    let signupForm = document.getElementById("signupForm");
    signupForm.addEventListener("submit", ev => {
        ev.preventDefault();
        let g = grecaptcha.execute();
    })
}

export const userService = {
    initlogin,
    initSignup
}