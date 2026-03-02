const User = require("../../Model/userModel");
const validateLogin = require("../../validation/login");
//const User = require("../Model/refreshtokenModel");
const jwt = require("jsonwebtoken");

const refreshTokens = [];
const adminController = {
	login: async (req, res) => {
		try {
			const { errors, isValid } = validateLogin(req.body);
			if (!isValid) {
				return res.json({ status: 0, errors });
			}
			const { email, password } = req.body;
			//Finding user's email.
			const user = await User.findOne({ email, role: 1 });
			if (!user) {
				return res.json({ status: 0, errors: { email: "User does not exist!" }});
			}

			if (!user.matchPassword(password, user.password)) {
				return res.json({ status: 0, errors: { password: "Incorrect password" }});
			}
			//Creating access unit.
			const accesstoken = createAccessToken({ id: user._id });
			//creating refresh unit.
			const refreshtoken = createRefreshToken({ id: user._id });
			refreshTokens.push(refreshtoken);

			res.cookie("refreshtoken", refreshtoken, {
				httpOnly: true,
				path: "/api/refresh_token",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			res.json({
				status: 1,
				msg: "Login Success",
				accesstoken,
				role: user.role,
				user: {
					...user._doc,
					password: " ",
				},
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	//Function to logout user.
	logout: async (req, res) => {
		try {
			res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
			refreshTokens.pop();

			if (!refreshTokens[0]) {
				return res.json({ status: 2, msg: "logged out" });
			}
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	//Function to check the refresh unit.
	refreshToken: (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken;
			if (!rf_token) {
				return res.json({ status: 0, msg: "please login first" });
			}
			//Verifying jwt unit
			jwt.verify(
				rf_token,
				process.env.REFRESH_TOKEN_SECRET,

				async (err, result) => {
					if (err) {
						return res.json({ status: 0, msg: "Please login first" });
					}
					if (!result) {
						return res.json({ status: 0, msg: "user does not exist" });
					}
					const user = await User.findById(result.id);
					const access_token = createAccessToken({ id: user.id });
					res.json({
						status: 1,
						access_token,
						role: user.role,
						user: {
							...user._doc,
							password: " ",
						},
					});
				},
			);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	//Function to get the user
	getUser: async (req, res) => {
		try {
			const user = await User.findById(req.body._id);
			if (!user) {
				return res.status(400).json({ msg: "user does not exist" });
			}
			res.json(user);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
};

//Function to to create access unit.
const createAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

//Function to to create refresh unit.
const createRefreshToken = (user) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = adminController;
