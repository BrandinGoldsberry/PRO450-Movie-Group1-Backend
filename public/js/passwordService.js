const resetPassword = (token, password, confirm) => {
    // TODO remove and replace with assignEventListener calls
    console.log(password, password.length, password.length < 6);
    if (password.length >= 6) {
        if (password === confirm) {
            axios.put('http://localhost:5001/users/update-password', {
                token,
                password
            }).then(res => {
                if (res) console.log('Password was successfully updated!');
                else console.log('Could not reset password');
            });
        } else console.log('Passwords do not match');
    } else console.log('Password must be at least 6 characters');
}

const initResetPass = () => {
    const resetPassForm = document.getElementById('resetPassForm');
    resetPassForm.addEventListener('submit', evt => {
        evt.preventDefault();
        resetPassword(evt.target[0].value, evt.target[1].value, evt.target[2].value);
    });
}

export const passwordService = {
    initResetPass
}