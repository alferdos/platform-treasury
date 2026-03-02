const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
	{
		userId: {
			type: String,
		},
		title: {
			type: String,
		},
		propertyEstimatedValue: {
			type: Number,
		},
		generatic_income: {
			type: Number,
		},
		propertyDeed: {
			type: String,
		},
		imageName: {
			type: [String],
		},
		address: { type: String },
		contract_address: { type: String },
		tokenPrice: { type: Number },
		description: { type: String, trim: true },
		percentageOfOwnership: { type: Number },
		totalTokenSupply: { type: Number },
		tokenSupply: { type: Number, default: 0 },
		status: { type: Number },
	},

	{
		timestamps: true,
	},
);

module.exports = mongoose.model("properties", propertySchema);
