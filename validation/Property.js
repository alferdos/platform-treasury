const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePropertyInput(data) {
	let errors = {};

	data._id = !isEmpty(data._id) ? data._id : "";
	data.title = !isEmpty(data.title) ? data.title : "";
	data.contract_address = !isEmpty(data.contract_address) ? data.contract_address : "";
	data.tokenPrice = !isEmpty(data.tokenPrice) ? data.tokenPrice : "";
	data.propertyEstimatedValue = !isEmpty(data.propertyEstimatedValue) ? data.propertyEstimatedValue : "";
	data.generatic_income = !isEmpty(data.generatic_income) ? data.generatic_income : "";
	data.address = !isEmpty(data.address) ? data.address : "";
	data.description = !isEmpty(data.description) ? data.description : "";
	data.imageName = !isEmpty(data.imageName) ? data.imageName : "";
	data.propertyDeed = !isEmpty(data.propertyDeed) ? data.propertyDeed : "";
	data.percentageOfOwnership = !isEmpty(data.percentageOfOwnership) ? data.percentageOfOwnership : "";
	data.status = !isEmpty(data.status) ? data.status : "";

	if (Validator.isEmpty(data.title)) {
		errors.title = "Title is required";
	}

	if (data.propertyEstimatedValue=="") {
		errors.propertyEstimatedValue = "Property Estimated Value is required";
	}

	if ((data.generatic_income).toString()=="") {
		errors.generatic_income = "Please Choose generatic income";
	}

	if (Validator.isEmpty(data.address)) {
		errors.address = "Address is required";
	}

	if (Validator.isEmpty(data.description)) {
		errors.description = "Description is required";
	}

	if(data._id!=""){
		if (Validator.isEmpty(data.contract_address)) {
			errors.contract_address = "Contract address is required";
		}

		if (data.tokenPrice=="") {
			errors.tokenPrice = "Unit Price is required";
		}

		if ((data.status).toString()=="") {
			errors.status = "Status is required";
		}
	}
	else{
		if (data.imageName.length === 0) {
			errors.imageName = "Property's image is required.";
		} else {
            data.imageName.forEach(n => {
                if (Validator.isEmpty(n)) {
                    errors.imageName = "All image files must have a valid name."
                }
            })
            
        }

		if (Validator.isEmpty(data.propertyDeed)) {
			errors.propertyDeed = "Property Deed is required";
		}
	}

	if (data.percentageOfOwnership=="") {
		errors.percentageOfOwnership = "Percentage Of Ownership is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
