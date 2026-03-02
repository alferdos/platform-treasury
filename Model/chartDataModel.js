const mongoose = require("mongoose");
const chartDataSchema = new mongoose.Schema(
	{
		propertyId: {
			type: String,
			required: true,
		},
		time: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		}
	},
	{
		timestamps: true,
	},
);
//Exporting file and set collection name user.
module.exports = mongoose.model("chartdata", chartDataSchema);
