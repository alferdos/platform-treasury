const Validator = require("validator");
const isEmpty = require("./is-empty");
const {
	password: passwordRegex,
	min: minLength,
	minPassword: minPasswordLength,
	max: maxLength,
} = require("./constants");

module.exports = function validateLoginInput(data) {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : "";
	data.password = !isEmpty(data.password) ? data.password : "";

	if (Validator.isEmpty(data.email)) {
		errors.email = "Email is required";
	}

	if (!Validator.isEmail(data.email)) {
    	errors.email = 'Email is invalid';
  	}

	if (Validator.isEmpty(data.password)) {
		errors.password = "Password is Required";
	} else if (!data.password.match(passwordRegex)) {
		errors.password = "The password should be of 8 characters, one special character, one capital letter, one numeric value.";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
