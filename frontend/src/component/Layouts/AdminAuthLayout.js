import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";

import AdminLogin from "../Admin/AdminLogin";

const AdminLayout = () => {
    let history = useHistory();
    const { auth } = useSelector((state) => state);
    useEffect(() => {
        if(auth.data){
			let response=auth.data;
			if(response.status==1){
                history.push("/admin/dashboard");
			}
		}
        window.scrollTo(0, 0);
    }, [auth]);
    return (
        <Switch>
            <Route exact path="/admin/login">
                <AdminLogin />
            </Route>
        </Switch>
    );
};

export default AdminLayout;