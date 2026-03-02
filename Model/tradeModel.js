const mongoose = require("mongoose");
//Model for user details.
const tradeSchema = new mongoose.Schema(
	{
		propertyId: {
			type: String,
			required: true,
			ref: 'properties',
		},
		userId: {
			type: String,
			required: true,
		},
		units: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
		},
		priceType: {
			type: String,
			required: true,
		},
		action: {
			type: String,
		    required: true,
		},
        isOpen: {
            type: Boolean,
            default: true
        }
	},
	{
		timestamps: true,
	},
);
//Exporting file and set collection name user.
module.exports = mongoose.model("trades", tradeSchema);
