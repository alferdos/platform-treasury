import React, { useState, useEffect } from "react";
import { login } from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import GlobalTypes from "../../redux/actions/GlobalTypes";

//for login checking email and password.
const Login = () => {
	const [passwordShown, setPasswordShown] = useState(false);
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const history = useHistory();
	if (auth.data) {
		var response = auth.data;
		if(response.errors===undefined){
			response.errors = 0;
		}
		if (response.status == 1 && response.action == "login") {
			history.push("/");
		}
	}

	const handleChange= (e) => {
		if(e.target.name=="email"){
			var val=e.target.value;
			var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if(val==""){
				document.querySelector(".email.error").innerHTML="Email is required";
			}
			else if(!val.match(validRegex)){
				document.querySelector(".email.error").innerHTML="Please enter a valid email address";
			}
			else{
				document.querySelector(".email.error").innerHTML="";
			}
		}
		if(e.target.name=="password"){
			var val=e.target.value;
			if(val==""){
				document.querySelector(".password.error").innerHTML="Password is required";
			}
			else{
				document.querySelector(".password.error").innerHTML="";
			}
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const { email, password } = e.target.elements;
		let userData = {
			email: email.value,
			password: password.value,
		};
		dispatch(login(userData));
	};
	const togglePasswordVisiblity = () => {
		setPasswordShown(passwordShown ? false : true);
	};
	return (
		<div>
			<section className="login">
				<img className="login_bg" src="/theme/images/login.jpg" />
				<div className="container">
					<div className="inner_login">
						<Link className="navbar-brand" to="/">
							<img src="/theme/images/logo.png" />
						</Link>
						<h2>Login</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label className="form-label">Email</label>
								<input
									type="text"
									className="form-control"
									name="email"
									placeholder="Email"
									onChange={handleChange}
								/>
								<span className="email error">{auth.data ? auth.data.errors.email : ""}</span>
							</div>
							<div className="mb-3 pass">
								<label className="form-label">Password</label>
								<input
									type={passwordShown ? "text" : "password"}
									className="form-control"
									name="password"
									placeholder="Password"
									onChange={handleChange}
								/>
								<span className="password error">{auth.data ? auth.data.errors.password : ""}</span>
								<a onClick={togglePasswordVisiblity}>
									<img src="/theme/images/showeye.png" />
								</a>
							</div>
							<div className="mb-3">
								<button type="submit" className="btn">
									Log In
								</button>
							</div>
							<p>
								Don’t have an account yet? <Link to="/register">Register</Link>
							</p>
							<p></p>
							{/* <p>
								<Link to="forgotPassword">Forgot Password?</Link>
							</p> */}
						</form>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Login;
