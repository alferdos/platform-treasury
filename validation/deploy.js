const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateDeploy(data) {
	let errors = {};

	data.contractName = !isEmpty(data.contractName) ? data.contractName : "";
	data.symbol = !isEmpty(data.symbol) ? data.symbol : "";
	data.totalsupply = !isEmpty(data.totalsupply) ? data.totalsupply : "";

	if (Validator.isEmpty(data.contractName)) {
		errors.contractName = "Contract Name is required";
	}
	if (Validator.isEmpty(data.symbol)) {
		errors.symbol = "Symbol is required";
	}
	if (Validator.isEmpty(data.totalsupply)) {
		errors.totalsupply = "Total Supply is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
