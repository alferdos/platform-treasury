const mongoose = require("mongoose");

//Model for creating ico.
const balanceSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			ref: 'users',
		},
		propertyId: {
			type: String,
			ref: 'properties',
		},
		units: {
			type: Number,
            default: 0
		},
		date: {
			type: String,
		},
	},

	{
		timestamps: true,
	},
);

//Exporting file and set collection name upProperty.
module.exports = mongoose.model("balances", balanceSchema);
