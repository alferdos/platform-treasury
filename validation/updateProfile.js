const Validator = require("validator");
const isEmpty = require("./is-empty");

const {
	password: passwordRegex,
	min: minLength,
	minPassword: minPasswordLength,
	max: maxLength,
} = require("./constants");

module.exports = function validateRegisterInput(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : "";
	data.phone_no = !isEmpty(data.phone_no) ? data.phone_no : "";
	data.national_id = !isEmpty(data.national_id) ? data.national_id : "";
	data.email = !isEmpty(data.email) ? data.email : "";
	data.new_password = !isEmpty(data.new_password) ? data.new_password : "";
	data.repeat_password = !isEmpty(data.repeat_password) ? data.repeat_password : "";

	if (Validator.isEmpty(data.name)) {
		errors.name = "Name is required";
	}
	if (Validator.isEmpty(data.national_id)) {
		errors.national_id = "National Id is required";
	} else if (data.national_id.length < 3 || data.national_id.length > 10) {
		errors.national_id = "ID length must be greater than 2 and less than 11 chracter!";
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = "Email is required";
	} else if (!Validator.isEmail(data.email)) {
		errors.email = "Please enter a valid email address";
	}

	if (Validator.isEmpty(data.phone_no)) {
		errors.phone_no = "Phone number is required";
	} else if (data.phone_no.length < 8 || data.phone_no.length > 8) {
		errors.phone_no = "Phone number length must be of 8 digits!";
	}

	if(data.new_password!=""){
		if (!data.new_password.match(passwordRegex)) {
			errors.new_password = "The password should be of 8 characters, one special character, one capital letter, one numeric value.";
		}

		if (Validator.isEmpty(data.repeat_password)) {
			errors.repeat_password = "Confirm Password is required";
		} else if (!Validator.equals(data.new_password, data.repeat_password)) {
			errors.repeat_password = "Password and Confirm password do not match";
		}
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
