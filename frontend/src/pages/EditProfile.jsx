import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { EDIT_PROFILE_URL } from "../constants/api";
import authConfig from "../util/authConfig";

import { updateUser } from "../features/auth/authSlice2";

export default function EditProfile() {
  const { user, token } = useSelector((state) => state.auth2);

  const [formData, setFormData] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  });
  const { firstName, lastName, email } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState();
  const [errorData, setErrorData] = useState();

  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    if (errorData) {
      setHelperText(errorData.message);
    }

    if (responseData) {
      dispatch(updateUser(responseData));
      navigate("/profile");
    }
  }, [errorData, responseData, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const userData = {
      firstName,
      lastName,
      email,
    };

    setIsLoading(true);
    axios
      .put(EDIT_PROFILE_URL, userData, authConfig(token))
      .then(({ data }) => setResponseData(data))
      .catch((error) => setErrorData(error.response.data.error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Edit Profile</h1>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                placeholder="First Name"
                className="input input-bordered"
                autoFocus
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={onChange}
                placeholder="Last Name"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
                className="input input-bordered"
              />
            </div>

            <p className="text-red-500 text-sm text-left">{helperText}</p>

            <div className="form-control mt-2">
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
