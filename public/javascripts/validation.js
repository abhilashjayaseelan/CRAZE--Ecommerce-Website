const nameError = document.getElementById('name-error');
const phoneError = document.getElementById('phone-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const submitError = document.getElementById('submit-error');
const pinCodeError = document.getElementById('pin-code-error');
const newPasswordError = document.getElementById('new-password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');

// name validation
function validateName() {
    let name = document.getElementById('user-name').value;

    if (name.length == 0) {
        nameError.innerHTML = 'Name is required';
        return false;
    }
    if (!name.match(/^[A-Za-z][A-Za-z '-]*$/)) {
        nameError.innerHTML = 'Name is invalid';
        return false;
    }
    nameError.innerHTML = '<i class="fa-solid fa-circle-check"></i>'
    return true;
}

// mobile number validation
function validatePhone() {
    let phone = document.getElementById('user-phone').value;

    if (phone.length == 0) {
        phoneError.innerHTML = 'Phone number is required';
        return false;
    }
    if (phone.length != 10) {
        phoneError.innerHTML = 'Number should be 10 digits';
        return false;
    }
    if (!phone.match(/^\d{10}$/)) {
        phoneError.innerHTML = 'Only numbers';
        return false;
    }
    phoneError.innerHTML = '<i class="fa-solid fa-circle-check"></i>'
    return true;
}

// email validation
function validateEmail() {
    var email = document.getElementById('user-email').value;

    if (email.length == 0) {
        emailError.innerHTML = 'email is required';
        return false;
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        emailError.innerHTML = 'email invalid';
        return false
    }
    emailError.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    return true;
}

// password validation
function validatePassword() {
    let password = document.getElementById('user-password').value;

    if (password.length < 6) {
        passwordError.innerHTML = 'Password must be at least 6 characters long';
        return false;
    }
    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) {
        passwordError.innerHTML = 'Password must include at least one letter and one digit';
        return false;
    }
    passwordError.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    return true;
}

// new password validation
function validateNewPassword() {
    let password = document.getElementById('user-new-password').value;

    if (password.length < 6) {
        newPasswordError.innerHTML = 'Password must be at least 6 characters long';
        return false;
    }
    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) {
        newPasswordError.innerHTML = 'Password must include at least one letter and one digit';
        return false;
    }
    newPasswordError.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    return true;
}

// confirm password
function validateConfirmPassword() {
    let password = document.getElementById('user-new-password').value;
    let conPassword = document.getElementById('user-confirm-password').value;

    if (password !== conPassword) {
        confirmPasswordError.innerHTML = 'Passwords does not match';
        return false;
    }
    confirmPasswordError.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    return true;

}

// submit validation
function validateForm(){
    if(!validateName() || !validatePhone() || !validateEmail() || !validatePassword()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please check the errors';
        setTimeout(function(){submitError.style.display = 'none';}, 3000);
        return false;
    }
}

// otp submit
function OTPvalidate(){
    if(!validatePhone()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please check the errors';
        setTimeout(function(){submitError.style.display = 'none';}, 3000);
        return false;
    }
}

// pincode validation
function validatePinCode() {
    let pinCode = document.getElementById('user-pin-code').value;

    if (pinCode.length !== 6) {
        pinCodeError.innerHTML = 'Pin code must be 6 digits long';
        return false;
    }
    if (!pinCode.match(/^\d{6}$/)) {
        pinCodeError.innerHTML = 'Pin code must only contain digits';
        return false;
    }
    pinCodeError.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    return true;
}

// address submit
function validateAddress() {
    if(!validateName() || !validatePinCode() || !validatePhone()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please check the errors';
        setTimeout(function(){submitError.style.display = 'none';}, 3000);
        return false;
    }
}

// login submit
function validateLogin() {
    if(!validateEmail() || !validatePassword()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please check the errors';
        setTimeout(function(){submitError.style.display = 'none';}, 3000);
        return false;
    }
}

//validate profile update
function validateProfileUpdate() {
    if(!validateEmail() || !validateName() || !validatePhone()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please check the errors';
        setTimeout(function(){submitError.style.display = 'none';}, 3000);
        return false;
    }
}



