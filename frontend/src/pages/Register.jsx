import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { register } from "../features/auth/authSlice2";
import axios from "axios";
import { REGISTER_URL } from "../constants/api";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });
  const { firstName, lastName, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState();
  const [errorData, setErrorData] = useState();

  const [helperText, setHelperText] = useState("");

  const { token, user } = useSelector((state) => state.auth2);

  useEffect(() => {
    if (errorData && !user) {
      setHelperText(errorData.message);
    }

    if (responseData && !user) {
      localStorage.setItem("token", responseData.token);
      dispatch(register(responseData));
    }

    if (token && user) {
      navigate("/");
    }
  }, [user, token, errorData, responseData, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (password !== password2) {
      setHelperText("Passwords do not match");
    } else {
      const userData = {
        firstName,
        lastName,
        email,
        password,
      };

      setIsLoading(true);
      axios
        .post(REGISTER_URL, userData)
        .then(({ data }) => setResponseData(data))
        .catch((error) => setErrorData(error.response.data.error))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Register</h1>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="input input-bordered"
              />
              <input
                type="password"
                name="password2"
                value={password2}
                onChange={onChange}
                placeholder="Confirm Password"
                className="input input-bordered mt-2"
              />
            </div>

            <p className="text-red-500 text-sm text-left">{helperText}</p>

            <div className="form-control mt-2">
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>

            <div className="form-control mt-2">
              <Link to="/login" className="btn btn-outline btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
