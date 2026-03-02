const mongoose = require("mongoose");

const blockchainSchema = mongoose.Schema(
	{
		propertyId: {
			type: String,
		},
		contractName: {
			type: String,
		},
		symbol: {
			type: String,
		},
		decimals: {
			type: String,
		},
		totalTokenSupply: {
			type: String,
		},
		transactionHash: {
			type: String,
		},
	},

	{
		timestamps: true,
	},
);

module.exports = mongoose.model("blockchains", blockchainSchema);
