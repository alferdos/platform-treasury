const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSendTokenByAdmin(data) {
	let errors = {};

	data.units = !isEmpty(data.units) ? data.units : "";
	data.propertyId = !isEmpty(data.propertyId) ? data.propertyId : "";

	if (Validator.isEmpty(data.units)) {
		errors.units = "Units is required";
	}

	if (Validator.isEmpty(data.propertyId)) {
		errors.propertyId = "Property is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
