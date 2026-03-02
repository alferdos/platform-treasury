const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateTransactionInput(data) {
  let errors = {};

  data.propertyId = !isEmpty(data.propertyId) ? data.propertyId : "";
  data.units = !isEmpty(data.units) ? data.units : "";

  if (Validator.isEmpty(data.propertyId)) {
    errors.propertyId = "PropertyId is required!";
  }

  if (Validator.isEmpty(data.units)) {
    errors.units = "Units is required!";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
