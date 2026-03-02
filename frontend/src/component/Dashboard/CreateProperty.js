import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";
import { createProperty } from "../../redux/actions/propertyAction";

//create property component to write all details from form.

const CreateProperty = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const intialImages = { thumbnails: {}, files: [] };
  const [images, setImages] = useState(intialImages);
  const [deedname, setDeedName] = useState("");
  const [deed, setDeed] = useState("");
  const { property, auth } = useSelector((state) => state);

  const initialState = {
    userId: auth.data ? auth.data.user._id : "",
    title: "",
    address: "",
    description: "",
    imageName: [],
    propertyEstimatedValue: "",
    generatic_income: "",
    propertyDeed: "",
    percentageOfOwnership: "",
  };

  if (property.data) {
    var response = property.data;
    if (response.status == 1) {
      response.errors = 0;
      swal(
        "Success",
        "Your property is submitted for review. It will take approx 1 to 2 business days for approve!",
        "success"
      );
      history.push("/");
      //setPropertyData(initialState)
      //setImages(intialImages)
      //setDeedName("")
      //setDeed("")
    }
  }

  const [propertyData, setPropertyData] = useState(initialState);

  const {
    userId,
    title,
    address,
    description,
    imageName,
    propertyEstimatedValue,
    generatic_income,
    propertyDeed,
    percentageOfOwnership,
  } = propertyData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name == "address") {
      document.querySelector(".add_map").classList.remove("hide");
      document
        .querySelector(".add_map")
        .setAttribute(
          "src",
          "https://www.google.com/maps/embed/v1/place?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&q=" +
            value
        );
    }
    setPropertyData({ ...propertyData, [name]: value });
  };

  const handleChangeFile = (file, set) => {
    if (set == "images") {
      if (file.length === 0) return;
      // discard images which are already uploaded by the user
      const selectimageName = (fileList) => fileList.map((i) => i.name);
      const alreadyUploadedImages = selectimageName(images.files);
      const uniqueImages = [];
      for (let i = 0; i < file.length; i++) {
        if (!alreadyUploadedImages.includes(file[i].name)) {
          const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
          if (file[i].size > maxSizeInBytes) {
            swal(
              "Warning",
              "Image size must not be greater than 1MB",
              "warning"
            );
            return;
          }
          uniqueImages.push(file[i]);
        }
      }
      // build thumbnails
      const newThumbnails = {};
      uniqueImages.forEach((i) => {
        newThumbnails[i.name] = window.URL.createObjectURL(i);
      });

      // update state
      setImages({
        thumbnails: { ...images.thumbnails, ...newThumbnails },
        files: images.files.concat(uniqueImages),
      });
      setPropertyData({
        ...propertyData,
        imageName: propertyData.imageName.concat(selectimageName(uniqueImages)),
      });
    } else {
      setDeedName(file.name);
      setDeed(file);
      setPropertyData({ ...propertyData, propertyDeed: file.name });
    }
  };

  function removeImage(name) {
    setImages((state) => {
      window.URL.revokeObjectURL(state.thumbnails[name]);
      delete state.thumbnails[name];
      const revisedImageFiles = state.files.filter((f) => f.name !== name);
      return {
        thumbnails: { ...state.thumbnails },
        files: [...revisedImageFiles],
      };
    });
    setPropertyData((state) => {
      return {
        ...state,
        imageName: state.imageName.filter((n) => n !== name),
      };
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProperty(propertyData, images.files, deed));
  };
  console.log(images, "pppppppppppp")
  return (
    <div className="main_content">
      <section>
        <div className="container">
          <div className="create">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={title}
                  placeholder="Title"
                  onChange={handleChangeInput}
                />
                <span className="error">
                  {property.data ? property.data.errors.title : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={address}
                  placeholder="Address"
                  onChange={handleChangeInput}
                />
                <span className="error">
                  {property.data ? property.data.errors.address : ""}
                </span>
                <iframe
                  className="add_map hide"
                  width="600"
                  height="450"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  type="text"
                  name="description"
                  value={description}
                  placeholder="Description"
                  onChange={handleChangeInput}
                />
                <span className="error">
                  {property.data ? property.data.errors.description : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Pictures</label>
                <div className="field" align="left">
                  {Object.keys(images.thumbnails)?.length !== 0 && (
                    <span className="uploaded-images">
                      {Object.entries(images.thumbnails).map(
                        ([title, srcURL], i) => {
                          {
                            /** TODO: Style thumbnails */
                          }
                          return (
                            <div key={i} className="thumbnail">
                              <button
                                type="button"
                                onClick={() => removeImage(title)}
                              >
                                x
                              </button>
                              <img alt={title} src={srcURL} />
                              {/* <span>{title}</span> */}
                            </div>
                          );
                        }
                      )}
                    </span>
                  )}
                  <span className="image-upload">
                    <label htmlFor="image-input">
                      <img src="/theme/images/upload.png" />
                      {""}
                    </label>
                    <input
                      id="image-input"
                      type="file"
                      name="imageName"
                      accept="image/*"
                      onChange={(e) =>
                        handleChangeFile(e.target.files, "images")
                      }
                      onClick={(e) => (e.target.value = null)}
                      multiple
                    />
                  </span>
                </div>
                <span className="error">
                  {property.data ? property.data.errors.imageName : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Property Estimated Value(in m2)
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="propertyEstimatedValue"
                  value={propertyEstimatedValue}
                  placeholder="Property Estimated Value"
                  onChange={handleChangeInput}
                />
                <span className="error">
                  {property.data
                    ? property.data.errors.propertyEstimatedValue
                    : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Generetic Income</label>
                <div className="radio_grd">
                  <label className="contain">
                    <input
                      className="form-control"
                      type="radio"
                      name="generatic_income"
                      value="1"
                      onChange={handleChangeInput}
                    />
                    <span className="checkmark"></span>Yes
                  </label>
                  <label className="contain">
                    <input
                      className="form-control"
                      type="radio"
                      name="generatic_income"
                      value="0"
                      onChange={handleChangeInput}
                    />
                    <span className="checkmark"></span>No
                  </label>
                </div>
                <span className="error">
                  {property.data ? property.data.errors.generatic_income : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Copy of the Propety Deed</label>
                <div className="field" align="left">
                  <div className="file-upload">
                    <label htmlFor="file-input">
                      <img src="/theme/images/upload.png" />
                      {deedname}
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      name="propertyDeed"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleChangeFile(e.target.files[0], "deed")
                      }
                    />
                  </div>
                </div>
                <span className="error">
                  {property.data ? property.data.errors.propertyDeed : ""}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Percentage of Ownership(In %)
                </label>
                <div className="percentageOfOwnership">
                  <input
                    className="form-control"
                    placeholder="Percentage of Ownership"
                    name="percentageOfOwnership"
                    value={percentageOfOwnership}
                    onChange={handleChangeInput}
                  />
                </div>
                <span className="error">
                  {property.data
                    ? property.data.errors.percentageOfOwnership
                    : ""}
                </span>
              </div>
              <div className="mb-3">
                <button type="submit" className="btn">
                  Create Property
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateProperty;
