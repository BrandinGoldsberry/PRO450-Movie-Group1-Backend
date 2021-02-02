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

const sendResetPassEmail = email => {
    axios.post('http://localhost:5001/email/reset-password', {
        email
    }).then(res => {
        if (res) alert(`An email was sent to ${email}`);
        else console.log('Could not send email'); // TODO error_msg
    });
}

const initlogin = () => {
    console.log('initializing login');
    // Login form functionality
    let loginForm = document.getElementById("logInForm");
    loginForm.addEventListener("submit", ev => {
        ev.preventDefault();
        login(ev.target[0].value, ev.target[1].value);
    });

    // Reset pass form functionality
    let resetPassForm = document.getElementById('resetPassForm');
    resetPassForm.addEventListener('submit', evt => {
        evt.preventDefault();
        sendResetPassEmail(evt.target[0].value);
    });
}

const signup = (captchaToken, formData) => {
    let fail = false;
    console.log(formData);
    let fname = formData[0].value;
    let lname = formData[1].value;
    let email = formData[2].value;
    let state = formData[3].value;
    let street = formData[4].value;
    let city = formData[5].value;
    let zipcode = formData[6].value;
    let phone = formData[7].value;
    let password = formData[8].value;

    let errorMsg = document.getElementById("signupError");

    if(!fname) {
        errorMsg.innerText = "Please enter a valid name";
        fail = true;
    } else if(!lname) {
        errorMsg.innerText = "Please enter a valid name";
        fail = true;
    } else if(!email) {
        errorMsg.innerText = "Please enter a valid email";
        fail = true;
    } else if(!state) {
        errorMsg.innerText = "Please enter a valid state";
        fail = true;
    } else if(!street) {
        errorMsg.innerText = "Please enter a valid Street";
        fail = true;
    } else if(!city) {
        errorMsg.innerText = "Please enter a valid city";
        fail = true;
    } else if(!zipcode) {
        errorMsg.innerText = "Please enter a valid zip code";
        fail = true;
    } else if(!phone) {
        errorMsg.innerText = "Please enter a valid phone number";
        fail = true;
    } else if(!password) {
        errorMsg.innerText = "Please enter a valid password";
        fail = true;
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
                grecaptcha.reset();
            }
        )
    }
    console.log(fail);
    if(fail) {
        grecaptcha.reset();
    }
}

const assignEventListener = async (message, elem, regex, errorId) => {
    console.log(elem);
    elem.addEventListener('keyup', (e) => {
        let val = e.target.value;
        let success = regex.test(val);
        let err = document.getElementById(errorId);
        if(!success) {
            err.innerText = message;
            err.className = "errorMessage";
        } else {
            err.innerText = "✓";
            err.className = "validMessage";
        }
    })
}

const initSignupValidation = async () => {
    let fname = document.getElementById("registerFName");
    let lname = document.getElementById("registerLName");
    let email = document.getElementById("registerEmail");
    let state = document.getElementById("registerState");
    let street = document.getElementById("registerStreet");
    let city = document.getElementById("registerCity");
    let zipcode = document.getElementById("registerZipCode");
    let phone = document.getElementById("registerPhone");
    let password = document.getElementById("registerPassword");

    assignEventListener("Please enter valid first name", fname, /[A-Za-z]+/i, "fnameError");
    assignEventListener("Please enter valid last name", lname, /[A-Za-z]+/i, "lnameError");
    assignEventListener("Please enter valid email", email, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i, "emailError");
    assignEventListener("Please enter valid street", street, /[A-Za-z]+/i, "streetError");
    assignEventListener("Please enter valid state", state, /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/, "stateError");
    assignEventListener("Please enter valid city", city, /[A-Za-z]+/i, "cityError");
    assignEventListener("Please enter valid zipcode", zipcode, /^\d{5}(?:[-\s]\d{4})?$/i, "zipcodeError");
    assignEventListener("Please enter valid phone", phone, /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i, "phoneError");
    assignEventListener("Password must be 6 characters, minimum allowed characters: !$%^&*(){}<>?/A-Za-z0-9", password, /[!$%^&*(){}<>?\/A-Za-z0-9]{6,}/i, "passError");
}

const initSignup = () => {
    initSignupValidation();
    let signupForm = document.getElementById("signupForm");
    signupForm.addEventListener("submit", ev => {
        ev.preventDefault();
        const onSignupCaptchaCompleted = (e) => {
            signup(e, ev.target);
        }
        window.onSignupCaptchaCompleted = onSignupCaptchaCompleted;
        let g = grecaptcha.execute();
    })
}

export const userService = {
    initlogin,
    initSignup
}