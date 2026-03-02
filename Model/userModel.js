const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

//Model for user details.
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		national_id: {
			type: String,
			unique: true,
			required: true,
		},
		phone_no: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		profile_image: {
			type: String,
		},
		totalBalance: {
			type: Number,
			default: 0,
		},
		role: {
			type: Number,
			default: 0,
		},
		walletAddress: {
			type: Object,
		},
		privateKey: {
			type: Object,
		},
	},
	{
		timestamps: true,
	},
);

// handle passwords
const saltRounds = 8
userSchema.methods.hash = plaintext => {
    return bcrypt.hashSync(plaintext, saltRounds)
}
userSchema.methods.matchPassword = (plaintext, password) => {
    return bcrypt.compareSync(plaintext, password)
}


//Exporting file and set collection name user.
module.exports = mongoose.model("users", userSchema);
