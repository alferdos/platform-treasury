const Validator = require("validator");
const isEmpty = require("./is-empty");

const {
  password: passwordRegex,
  repeat_password: repeat_passwordRegex,
  min: minLength,
  minPassword: minPasswordLength,
  max: maxLength,
} = require("./constants");

module.exports = function validateUpdatePassword(data) {
  let errors = {};

  data.new_password = !isEmpty(data.new_password) ? data.new_password : "";
  data.confirm_new_password = !isEmpty(data.confirm_new_password) ? data.confirm_new_password : "";

  if (Validator.isEmpty(data.new_password)) {
    errors.new_password = "please enter your new password";
  } else if (!data.new_password.match(passwordRegex)) {
    errors.new_password = "please enter a valid new password";
  }

  if (Validator.isEmpty(data.confirm_new_password)) {
    errors.confirm_new_password = "please confirm new password";
  } else if (data.new_password != data.confirm_new_password) {
    errors.confirm_new_password = "new password and confirm new password has not matched";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
