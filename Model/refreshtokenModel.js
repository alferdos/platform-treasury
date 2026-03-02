const mongoose = require("mongoose");
//Model for user details.
const refreshSchema = new mongoose.Schema(
	{
		user_id: {
			type: String,
			required: true,
		},
		ref_token: {
			type: String,
			required: true,
			unique: true,
		},
     },
	{
		timestamps: true,
	},
);
//Exporting file and set collection name user.
module.exports = mongoose.model("ref_token_property", refreshSchema);
