import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { register } from "../../redux/actions/authAction";

//component for registration.
const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [checkBox, setCheckBox] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const { auth } = useSelector((state) => state);
  if (auth.data) {
    var response = auth.data;
    if (response.errors === undefined) {
      response.errors = 0;
    }
    if (response.status == 1 && response.action == "register") {
      history.push("/login");
    }
  }

  const handleChange = (e) => {
    if (e.target.name == "name") {
      var val = e.target.value;
      var letters = /^[A-Za-z\s]+$/;
      if (val == "") {
        document.querySelector(".name.error").innerHTML = "Name is required";
      } else if (!val.match(letters)) {
        document.querySelector(".name.error").innerHTML =
          "Only letters required";
      } else {
        document.querySelector(".name.error").innerHTML = "";
      }
    }
    if (e.target.name == "email") {
      var val = e.target.value;
      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (val == "") {
        document.querySelector(".email.error").innerHTML = "Email is required";
      } else if (!val.match(validRegex)) {
        document.querySelector(".email.error").innerHTML =
          "Please enter a valid email address";
      } else {
        document.querySelector(".email.error").innerHTML = "";
      }
    }
    if (e.target.name == "national_id") {
      var val = e.target.value;
      if (val == "") {
        document.querySelector(".national_id.error").innerHTML =
          "National Id is required";
      } else if (val.length <= 2 || val.length > 10) {
        document.querySelector(".national_id.error").innerHTML =
          "ID length must be greater than 2 and less than 10 chracter!";
      } else {
        document.querySelector(".national_id.error").innerHTML = "";
      }
    }
    if (e.target.name == "phone_no") {
      var val = e.target.value;
      if (val == "") {
        document.querySelector(".phone_no.error").innerHTML =
          "Phone Number is required";
      } else if (val.length < 8 || val.length > 8) {
        document.querySelector(".phone_no.error").innerHTML =
          "Phone number length must be of 8 digits!";
      } else {
        document.querySelector(".phone_no.error").innerHTML = "";
      }
    }
    if (e.target.name == "password") {
      var val = e.target.value;
      var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
      if (val == "") {
        document.querySelector(".password.error").innerHTML =
          "Password is required";
      } else if (!regex.test(val)) {
        document.querySelector(".password.error").innerHTML =
          "The password should be of 8 characters, one special character, one capital letter, one numeric value.";
      } else {
        document.querySelector(".password.error").innerHTML = "";
      }
    }
    if (e.target.name == "repeat_password") {
      var val = e.target.value;
      var password = document.querySelector('[name="password"]').value;
      if (val == "") {
        document.querySelector(".repeat_password.error").innerHTML =
          "Confirm password is required";
      } else if (val != password) {
        document.querySelector(".repeat_password.error").innerHTML =
          "Password and Confirm password do not match";
      } else {
        document.querySelector(".repeat_password.error").innerHTML = "";
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, national_id, phone_no, password, repeat_password } =
      e.target.elements;
    let userData = {
      name: name.value,
      email: email.value,
      national_id: national_id.value,
      phone_no: phone_no.value,
      password: password.value,
      repeat_password: repeat_password.value,
    };
    dispatch(register(userData));
  };
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
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
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
                <span className="name error">
                  {auth.data ? auth.data.errors.name : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
                <span className="email error">
                  {auth.data ? auth.data.errors.email : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">National ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="national_id"
                  placeholder="XXXXXXXXXX"
                  onChange={handleChange}
                />
                <span className="national_id error">
                  {auth.data ? auth.data.errors.national_id : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <div className="PhNumbDiv">
                  <input
                    type="number"
                    className="form-control numbcheck pdR"
                    name="phone_no_prefix"
                    placeholder="(05)"
                    disabled="true"
                  />
                  <input
                    type="number"
                    className="form-control numbcheck pdl"
                    name="phone_no"
                    placeholder="XXX-XXX-XX"
                    onChange={handleChange}
                  />
                </div>
                <span className="phone_no error">
                  {auth.data ? auth.data.errors.phone_no : ""}
                </span>
              </div>
              <div className="mb-3 pass">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="********"
                  onChange={handleChange}
                />
                <span className="password error">
                  {auth.data ? auth.data.errors.password : ""}
                </span>
              </div>
              <div className="mb-3 pass">
                <label className="form-label">Repeat Password</label>
                <input
                  type={passwordShown ? "text" : "password"}
                  className="form-control"
                  name="repeat_password"
                  placeholder="********"
                  onChange={handleChange}
                />
                <span className="repeat_password error">
                  {auth.data ? auth.data.errors.repeat_password : ""}
                </span>
                <a onClick={togglePasswordVisiblity}>
                  {<img src={"/theme/images/showeye.png"} />}
                </a>
              </div>
              <div className="mb-3">
                <label className="form-label contain">
                  <div className="form-check">
                    <input
                      className="form-control"
                      type="checkbox"
                      name="checked"
                      value={checkBox}
                      onChange={(e) => setCheckBox(e.target.checked)}
                    />
                    <span className="checkmark2"></span>Accept Terms & Service
                  </div>
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  {checkBox ? (
                    <button type="submit" className="btn">
                      Register
                    </button>
                  ) : (
                    ""
                  )}
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <p>
                    Already have an account? <Link to="/login">Log in</Link>
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

export default Register;
