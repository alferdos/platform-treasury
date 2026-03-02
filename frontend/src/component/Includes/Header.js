import React, { useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import login from "../Auth/Login";
import i from "../../images/Logo.png";
import Web3 from "web3";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
	const { auth } = useSelector((state) => state);
	const currentPathName = window.location.pathname;
	return (
		<header>
			<nav
				className="navbar navbar-expand-lg text-uppercase fixed-top"
				id="mainNav">
				<div className="container">
					<Link className="navbar-brand" to="/">
						<img src={i} />
					</Link>
					<button
						className="navbar-toggler text-uppercase font-weight-bold rounded"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarResponsive"
						aria-controls="navbarResponsive"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<i className="fas fa-bars"></i>
					</button>
					<div className="collapse navbar-collapse" id="navbarResponsive">
						<ul className="navbar-nav ms-auto">
							<li className="nav-item mx-0 mx-lg-1">
								<Link className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/about')?'btn':''}`} to="/about">
									About
								</Link>
							</li>
                        	<li className="nav-item mx-0 mx-lg-1">
								<Link className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/howitwork')?'btn':''}`} to="/howitwork">
									How it works
								</Link>
							</li>
                        	<li className="nav-item mx-0 mx-lg-1">
								<Link className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/blog')?'btn':''}`} to="/blog">
									Blog
								</Link>
							</li>
							<li className="nav-item mx-0 mx-lg-1">
								<Link className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/contactus')?'btn':''}`} to="/contactus">
									Contact Us
								</Link>
							</li>
							<li className="nav-item mx-0 mx-lg-1">
								<Link className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/login')?'btn':''}`} to={`/login`}>
									Login
								</Link>
							</li>
							<li className="nav-item mx-0 mx-lg-1">
								<Link className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/register')?'btn':''}`} to={"/register"}>
									Sign Up
								</Link>
							</li>
							<li className="nav-item mx-0 mx-lg-1">
								<Link className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/login')?'btn':''}`} to="/login">
									List Property
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default memo(Header);
