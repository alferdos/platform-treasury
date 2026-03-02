import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";

import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ForgotPassword from "../Auth/ForgotPassword";

const AdminLayout = () => {
    let history = useHistory();
    const { auth } = useSelector((state) => state);
    useEffect(() => {
        if(auth.data){
			let response=auth.data;
			if(response.status==1 && !(response.action)){
				history.push("/");
			}
		}
        window.scrollTo(0, 0);
    }, [auth]);
    return (
        <Switch>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/register">
                <Register />
            </Route>
            <Route exact path="/forgotPassword">
                <ForgotPassword />
            </Route>
        </Switch>
    );
};

export default AdminLayout;