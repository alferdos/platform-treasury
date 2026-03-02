import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { refreshToken, updateProfile, updateProfilePic } from "../../redux/actions/authAction";
import { postDataAPIBare, getDataAPI } from "../../utils/API";
import Modal from "@material-ui/core/Modal";

const Profile = () => {
  const dispatch = useDispatch();
  const [authuser, setAuthUser] = useState("");
  const [errors, setErrors] = useState({});
  const { auth } = useSelector((state) => state);
  useEffect(() => {
    if (auth.data) {
      var response = auth.data;
      if (response.errors === undefined) {
        response.errors = 0;
      }
      if (response.status === 1) {
        setAuthUser(response.user);
        if (response.user.phone_no) {
          const number = response.user.phone_no; // Example number
          // const numberString = number.toString();
          const result = number.slice(2);
          setAuthUser((prevState) => ({
            ...prevState,
            phone_no: result,
          }));
        }
      }
    }
  }, [auth]);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAuthUser({ [name]: value });

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
  };
  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      email,
      national_id,
      phone_no,
      new_password,
      repeat_password,
    } = e.target.elements;
    let userData = {
      user_id: auth.data ? auth.data.user._id : "",
      name: name.value,
      email: email.value,
      national_id: national_id.value,
      phone_no: phone_no.value,
      new_password: new_password.value,
      repeat_password: repeat_password.value,
    };
    //dispatch(updateProfile(userData));
    postDataAPIBare("update_profile", userData).then(function (res) {
      let response = res.data;
      if (response.status == 0) {
        setErrors(response.errors);
      } else {
        swal("Success", "Profile updated successfully!", "success");
      }
    });
  };

  const handleChangeFile = (file) => {
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      swal("Warning", "Image size must not be greater than 1MB", "warning");
      setImage("");
      Open(false);
      return;
    } 
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData();

    formData.append("file", image);
    formData.append("user_id", auth.data ? auth.data.user._id : "");

    // dispatch(updateProfilePic(formData));
    Open(false);
    postDataAPIBare("update_profilePic", formData).then(function (res) {
      let response = res.data;
      if (response.status == 1) {
        document
          .querySelector(".profile_img")
          .setAttribute("src", "/profilePic/" + response.imagename);
          dispatch(refreshToken());
        Open(false);
        swal("Success", "Profile image updated successfully!", "success");
      }
    });
  };

  const [image, setImage] = useState("");
  const [open, Open] = React.useState(false);
  const Profile = async () => {
    Open(true);
  };
  const handleClose = () => {
    Open(false);
  };
  const bodyChangeAvatar = () => {
    return (
      <div className="paper">
        <div className="paper-head">
          <h2 className="paper_h2" id="simple-modal-title">
            Upload
          </h2>
          <span onClick={handleClose}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
        </div>
        <div className="paper-inner">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Select Profile Picture</label>
              <input
                className="form-control"
                type="file"
                name="profilePicture"
                onChange={(e) => handleChangeFile(e.target.files[0])}
                required
              />
            </div>
            <button className="btn btn-default">Upload</button>
          </form>
        </div>
      </div>
    );
  };
  return (
    <div className="main_content">
      <section className="profile">
        <div className="container">
          <h3>My Profile</h3>
          <div className="inner_profile">
            <div className="profile_image">
              <div className="img_edit">
                <img
                  className="profile_img"
                  src={`/profilePic/${
                    auth.data ? auth?.data?.user?.profile_image : ""
                  }`}
                />
                <a
                  className="edi_t"
                  href="javascript:void(0);"
                  onClick={() => Profile()}
                >
                  <img src="/theme/images/edit.png" />
                </a>
              </div>
              <h4>
                <Link to="transactions">View Transactions</Link>
              </h4>
            </div>
            <div className="profile_details">
              <form onSubmit={updateProfileSubmit.bind(this)}>
                <div className="mb-4">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Full Name"
                    value={authuser.name}
                    onChange={handleChangeInput}
                  />
                  <span className="name error">{errors.name}</span>
                </div>
                <div className="mb-4">
                  <label className="form-label">Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder="Email Address"
                    value={authuser.email}
                    onChange={handleChangeInput}
                  />
                  <span className="email error">{errors.email}</span>
                </div>
                <div className="mb-4">
                  <label className="form-label">National ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="national_id"
                    placeholder="XXXXX"
                    value={authuser.national_id}
                    onChange={handleChangeInput}
                  />
                  <span className="national_id error">
                    {errors.national_id}
                  </span>
                </div>
                <div className="mb-4">
                  <label className="form-label">Phone Number</label>
                  <div className="PhNumbDivUpdate">
                    <input
                      type="number"
                      className="form-control numbcheck pdR"
                      name="phone_no_prefix"
                      placeholder="(05)"
                      disabled="true"
                    />
                    <input
                      ttype="number"
                      className="form-control numbcheck pdl"
                      name="phone_no"
                      placeholder="XXX-XXX-XX"
                      value={authuser.phone_no}
                      onChange={handleChangeInput}
                    />
                  </div>

                  <span className="phone_no error">{errors.phone_no}</span>
                </div>
                <div className="mb-4">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="new_password"
                    placeholder="***********"
                  />
                  <span className="error">{errors.new_password}</span>
                </div>
                <div className="mb-5">
                  <label className="form-label">Repeat Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="repeat_password"
                    placeholder="***********"
                  />
                  <span className="error">{errors.repeat_password}</span>
                </div>
                <div className="mb-4">
                  <button type="submit" className="btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {bodyChangeAvatar()}
        </Modal>
      </div>
    </div>
  );
};
export default Profile;
