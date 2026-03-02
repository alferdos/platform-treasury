const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTradeInput(data) {
	let errors = {};

	data.units = !isEmpty(data.units) ? data.units : "";
	data.priceType = !isEmpty(data.priceType) ? data.priceType : "";
	data.price = !isEmpty(data.price) ? data.price : "";
	data.action = !isEmpty(data.action) ? data.action : "";

	if (data.units=="") {
		errors.units = "Units is required";
	} else if ( data.units <= 0) {
        errors.units = "Enter a postive number."
    }

	if (Validator.isEmpty(data.priceType)) {
    	errors.priceType = 'Price Type is required';
  	}
	
	if(data.priceType=="customPrice"){
		if (data.price=="") {
			errors.price = "Price is required";
		}
	}

	if (Validator.isEmpty(data.action)) {
    	errors.action = 'Action is required';
  	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
