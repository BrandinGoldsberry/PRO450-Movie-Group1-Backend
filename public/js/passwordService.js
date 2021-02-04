const validationEvent = evt => {
    let password = document.getElementById('password').value;
    let confirm = document.getElementById('confirm').value;

    // Password
    let passError = document.getElementById('passError');
    if (!/[!$%^&*(){}<>?\/A-Za-z0-9]{6,}/i.test(password)) {
        passError.innerText = 'Password must be 6 characters, minimum allowed characters: !$%^&*(){}<>?/A-Za-z0-9';
        passError.className = 'errorMessage';
    } else {
        passError.innerText = '✓';
        passError.className = 'validMessage';
    }

    // Confirm Password
    let confirmError = document.getElementById('confirmError');
    if (password !== confirm) {
        confirmError.innerText = 'Passwords do not match';
        confirmError.className = 'errorMessage';
    } else {
        confirmError.innerText = '✓';
        confirmError.className = 'validMessage';
    }
}

const resetPassword = (token, password, confirm) => {
    let errorMsg = document.getElementById("resetPassError");
    if (password.length >= 6) {
        if (password === confirm) {
            errorMsg.innerText = '';
            axios.put('http://localhost:5001/users/update-password', {
                token,
                password
            }).then(res => {
                if (res) alert('Password was successfully updated!');
                else errorMsg.innerText = 'Could not reset password';
            });
        } else errorMsg.innerText = 'Passwords do not match';
    } else errorMsg.innerText = 'Password must be at least 6 characters';
}

const initResetPassValidation = () => {
    let password = document.getElementById('password');
    let confirm = document.getElementById('confirm');
    password.addEventListener('keyup', validationEvent);
    confirm.addEventListener('keyup', validationEvent);
}

const initResetPass = () => {
    initResetPassValidation();
    const resetPassForm = document.getElementById('resetPassForm');
    resetPassForm.addEventListener('submit', evt => {
        evt.preventDefault();
        resetPassword(evt.target[0].value, evt.target[1].value, evt.target[2].value);
    });
}

export const passwordService = {
    initResetPass
}