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
    const resetPassError = document.getElementById('resetPassError');
    resetPassError.innerText = '';
    axios.post('http://localhost:5001/email/reset-password', {
        email
    }).then(res => {
        console.log(res.data);
        if (res.data) {
            document.getElementById('email').value = "";
            alert(`An email was sent to ${email}`);
        } else resetPassError.innerText = 'Could not send email';
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
    let signupError = document.getElementById("signupError");
    signupError.innerText = "";

    axios.post("http://localhost:5001/users/sign-up", {
        fname: formData[0].value,
        lname: formData[1].value,
        email: formData[2].value,
        state: formData[3].value,
        street: formData[4].value,
        city: formData[5].value,
        zip_code: formData[6].value,
        phone: formData[7].value,
        password: formData[8].value,
        username: `${formData[0].value.toLowerCase()}${formData[1].value.charAt(0).toLowerCase()}`,
        captchaToken
    }).then(res => {
        // console.log(res.data);
        if (res.data.success) {
            Cookies.set("username", res.data.message.username);
            Cookies.set("admin", res.data.message.admin);
            Cookies.set("id", res.data.message.id);
            Cookies.set("superadmin", res.data.message.superAdmin);
            Cookies.set("email", res.data.message.email);
            location.assign("/");
        } else {
            console.log(signupError);
            console.log(res.data.message);
            grecaptcha.reset();
            signupError.innerText = res.data.message;
        }
    });
}

const assignEventListener = async (message, elem, regex, errorId, validateImmediately = false) => {
    elem.addEventListener('keyup', evt => {
        let val = evt.target.value;
        let success = regex.test(val);
        let err = document.getElementById(errorId);
        if(!success) {
            err.innerText = message;
            err.className = "errorMessage";
        } else {
            err.innerText = "✓";
            err.className = "validMessage";
        }
    });
    if (validateImmediately) {
        const event = document.createEvent('Event');
        event.initEvent('keyup', true, true);
        elem.dispatchEvent(event);
    }
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

const editAccount = userData => {
    let errorMsg = document.getElementById("editAccountError");
    errorMsg.innerText = "";
    console.log(userData);
    axios.put('http://localhost:5001/users/update-user', userData)
    .then(res => {
        if (res.data.success) alert(res.data.message);
        else errorMsg.innerText = res.data.message;
    });
}

const initEditAccountValidation = () => {
    let fname = document.getElementById("fName");
    let lname = document.getElementById("lName");
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let state = document.getElementById("state");
    let street = document.getElementById("street");
    let city = document.getElementById("city");
    let zipcode = document.getElementById("zipCode");
    let phone = document.getElementById("phone");

    assignEventListener("Please enter valid first name", fname, /[A-Za-z]+/i, "fnameError", true);
    assignEventListener("Please enter valid last name", lname, /[A-Za-z]+/i, "lnameError", true);
    assignEventListener("Please enter valid username", username, /[A-Za-z]{5,}/i, "usernameError", true);
    assignEventListener("Please enter valid email", email, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i, "emailError", true);
    assignEventListener("Please enter valid street", street, /[A-Za-z]+/i, "streetError", true);
    assignEventListener("Please enter valid state", state, /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/, "stateError", true);
    assignEventListener("Please enter valid city", city, /[A-Za-z]+/i, "cityError", true);
    assignEventListener("Please enter valid zipcode", zipcode, /^\d{5}(?:[-\s]\d{4})?$/i, "zipcodeError", true);
    assignEventListener("Please enter valid phone", phone, /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i, "phoneError", true);
}

const initEditAccount = async () => {
    const userId = Cookies.get('id');
    // console.log(userId);
    if (userId) {
        await axios.post(`http://localhost:5001/users/get-user-by-id?userId=${userId}`)
        .then(res => {
            if (res.data.user) {
                console.log(res.data.user);
                document.getElementById('fName').value = res.data.user.fname;
                document.getElementById('lName').value = res.data.user.lname;
                document.getElementById('username').value = res.data.user.username;
                document.getElementById('email').value = res.data.user.email;
                document.getElementById('street').value = res.data.user.street;
                document.getElementById('city').value = res.data.user.city;
                document.getElementById('state').value = res.data.user.state;
                document.getElementById('zipCode').value = res.data.user.zip_code;
                document.getElementById('phone').value = res.data.user.phone;
                initEditAccountValidation();
            }
        });
    } else location.replace('/');
    let editAccountForm = document.getElementById('editAccountForm');
    editAccountForm.addEventListener('submit', evt => {
        evt.preventDefault();
        editAccount({
            userId,
            fname: document.getElementById('fName').value,
            lname: document.getElementById('lName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            phone: document.getElementById('phone').value
        });
    });
}

export const userService = {
    initlogin,
    initSignup,
    initEditAccount
}