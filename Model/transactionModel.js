const mongoose = require("mongoose");
//Model for user details.
const transactionSchema = new mongoose.Schema(
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
		action: {
			type: String,
		    required: true,
		},
        price: {
            type: Number,
            required: true
        },
        isSubscription: {
            type: Boolean,
            default: true
        }
	},
	{
		timestamps: true,
	},
);

//Exporting file and set collection name user.
module.exports = mongoose.model("transactions", transactionSchema);
