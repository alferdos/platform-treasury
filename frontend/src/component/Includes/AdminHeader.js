import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useHistory, Link, NavLink } from "react-router-dom";
import i from "../../images/Logo.png";
import { logout } from "../../redux/actions/authAction";
import "react-toastify/dist/ReactToastify.css";

//admin header component.
const AdminHeader = () => {
  const history = useHistory();
  const { auth } = useSelector((state) => state);
  if (auth.data) {
    var response = auth.data;
    if (response.status == 1 && response.action == "logout") {
      response.user = { name: "" }; // 🟡 direct mutation of app state!
      history.push("/admin/login");
      swal("Success", "You have successfully logout!", "success");
    }
  }
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [Admintoggle, setAdminToggle] = useState(false);

  const toggleDropdown = () => {
    setToggle(toggle ? false : true);
  };
  const drop_toggle = () => {
    setAdminToggle(Admintoggle ? false : true);
  };

  const currentPathName = window.location.pathname;

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg text-uppercase fixed-top"
        id="mainNav"
      >
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
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-0 mx-lg-1">
                <Link
                  className={`nav-link py-3 px-0 px-lg-3 rounded ${
                    currentPathName == "/admin/blockchaindata" ? "btn" : ""
                  }`}
                  to={`/admin/blockchaindata`}
                >
                  Blockchain Data
                </Link>
              </li>
              <li className="nav-item mx-0 mx-lg-1">
                <Link
                  className={`nav-link py-3 px-0 px-lg-3 rounded ${
                    currentPathName == "/admin/users" ? "btn" : ""
                  }`}
                  to={`/admin/users`}
                >
                  Users
                </Link>
              </li>
              <li className="nav-item mx-0 mx-lg-1">
                <Link
                  className={`nav-link py-3 px-0 px-lg-3 rounded ${
                    currentPathName == "/admin/requestFund" ? "btn" : ""
                  }`}
                  to={`/admin/requestFund`}
                >
                  Request Fund
                </Link>
              </li>
              <li className="nav-item mx-0 mx-lg-1">
                <Link
                  className={`nav-link py-3 px-0 px-lg-3 rounded ${
                    currentPathName == "/admin/properties" ? "btn" : ""
                  }`}
                  to={`/admin/properties`}
                >
                  Properties
                </Link>
              </li>
              {/* <li className="nav-item mx-0 mx-lg-1">
								<Link
									className={`nav-link py-3 px-0 px-lg-3 rounded ${(currentPathName=='/admin/transactions')?'btn':''}`}
									to={`/admin/transactions`}>
									Portfolio
								</Link>
							</li> */}
              <li className="nav-item mx-0 mx-lg-1">
                <Link
                  className={`nav-link py-3 px-0 px-lg-3 rounded ${
                    currentPathName == "#" ? "btn" : ""
                  }`}
                  to="#"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </Link>
              </li>
              <li className="nav-item mx-0 mx-lg-1">
                <Link
                  className="nav-link py-3 px-0 px-lg-3 rounded profile"
                  to="/admin/profile"
                >
                  <img
                    src={auth.data?.user?.profile_image && auth.data.user.profile_image.startsWith('http')
                      ? auth.data.user.profile_image
                      : `https://res.cloudinary.com/dfzwynbsl/image/upload/w_40,h_40,c_fill,r_max,co_rgb:f8b602,l_text:Arial_20_bold:${(auth.data?.user?.name || 'A').charAt(0).toUpperCase()}/fl_layer_apply/v1773045169/avatar_base.png`}
                    onError={e => { e.target.src = `https://res.cloudinary.com/dfzwynbsl/image/upload/w_40,h_40,c_fill,r_max,co_rgb:f8b602,l_text:Arial_20_bold:A/fl_layer_apply/v1773045169/avatar_base.png`; }}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', marginRight: '6px' }}
                    alt="profile"
                  />
                  Welcome, {auth.data ? auth.data.user.name.split(" ")[0] : ""}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
