import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Link, useHistory } from "react-router-dom";

import Profile from "../Dashboard/Profile";
import CreateProperty from "../Dashboard/CreateProperty";
import ViewProperty from "../Dashboard/ViewProperty";
import TradeProperty from "../Dashboard/TradeProperty";
import Transactions from "../Dashboard/Transactions";
import DashboardHeader from "../Includes/DashboardHeader";
import Footer from "../Includes/Footer";

//admin layout component
const DashboardLayout = () => {
	let history = useHistory();
	const { auth } = useSelector((state) => state);
    useEffect(() => {
		if(auth.data){
			let response=auth.data;
			if(response.status==0){
				history.push("/login");
			}
			// else{
			// 	if(response.user.role==1){
			// 		history.push("/");
			// 	}
			// }
		}
		window.scrollTo(0, 0);
    }, [auth]);
	return (
		<div className="dashboard">
			<DashboardHeader />
			<div className="right-panal">
				<Switch>
					<Route exact path="/dashboard/profile">
						<Profile />
					</Route>
					<Route exact path="/dashboard/createproperty">
						<CreateProperty />
					</Route>
					<Route exact path="/dashboard/viewproperty/:id">
						<ViewProperty />
					</Route>
					<Route exact path="/dashboard/tradeproperty/:id">
						<TradeProperty />
					</Route>
					<Route exact path="/dashboard/transactions">
						<Transactions />
					</Route>
				</Switch>
			</div>
			<Footer />
		</div>
	);
};

export default DashboardLayout;
