const mongoose = require("mongoose");
//Model for user details.
const requestFundSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			ref: 'users',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		invoice: {
			type: String,
			required: true,
		},
        isApproved: {
            type: Boolean,
            default: false
        }
	},
	{
		timestamps: true,
	},
);
//Exporting file and set collection name user.
module.exports = mongoose.model("requestFunds", requestFundSchema);
