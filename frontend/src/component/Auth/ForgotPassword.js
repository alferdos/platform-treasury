import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgot_password } from "../../redux/actions/authAction";

//component for registration.
const ForgotPassword = () => {
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	if (auth.data) {
		var response = auth.data;
		if (response.status == 1) {
		  response.errors= 0;
		}
	}

	const initialState = {
		email: "",
	};
	const [userData, setUserData] = useState(initialState);

	const { email } = userData;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(forgot_password(userData));
	};

	return (
		<div>
			<section className="login">
				<img className="login_bg" src="theme/images/login.jpg" />
				<div className="container">
					<div className="inner_login">
						<Link className="navbar-brand" to="/">
							<img src="/theme/images/logo.png" />
						</Link>
						<h2>Add Email</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label className="form-label">Email</label>
								<input
									type="text"
									className="form-control"
									name="email"
									value={email}
									placeholder="Email"
									onChange={handleChangeInput}
								/>
								<span className="error">{auth.data ? auth.data.errors.email : ""}</span>
							</div>
							<div className="mb-3">
								<button type="submit" className="btn">
									Change Password
								</button>
							</div>
							<div className="mb-3">
								<label className="form-label">
									<p>
										Login Here ? <Link to="login">Log in</Link>
									</p>
								</label>
							</div>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ForgotPassword;
