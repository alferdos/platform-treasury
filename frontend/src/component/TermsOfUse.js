import React, {useState, useEffect, memo} from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Includes/Header"
import DashboardHeader from "./Includes/DashboardHeader";
import AdminHeader from "./Includes/AdminHeader";
import Footer from "./Includes/Footer"

const TermsOfUse = () => {
    const [header, setHeader] = useState("guest");
    const { auth } = useSelector((state) => state);
	useEffect(() => {
		if(auth.data){
			let response=auth.data;
			if(response.status==1){
				if(response.user.role!=1){
					setHeader("dashboard");
				}
				else{
					setHeader("admin");
				}
			}
			else{
				setHeader("guest");
			}
		}
	}, [auth]);
    return (
        <div>
            {
				(header=="guest")?<Header/>:(header=="dashboard")?<DashboardHeader/>:<AdminHeader/>
			}
            <div className="main_content">
                <div className="container_cust">
                    <h3 className="title-main">
                        Terms of Use
                    </h3>
                    <div className="sub-title">
                        <p className="policy-paragrph">Terms of Use content Here...</p>
                    </div>
                </div>
            </div>    
            <Footer />
        </div>
    );
};

export default memo(TermsOfUse);
