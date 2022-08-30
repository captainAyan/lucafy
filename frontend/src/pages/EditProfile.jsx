import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { edit, reset } from "../features/auth/authSlice";

export default function EditProfile() {
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    firstName: user && user.firstName,
    lastName: user && user.lastName,
    email: user && user.email,
  });
  const { firstName, lastName, email } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    if (isError) {
      setHelperText(message);
    }

    if (isSuccess) {
      navigate("/profile");
    }

    if (!user) {
      navigate("/");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

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

    dispatch(edit(userData));
  };

  return (
    <div className="card w-full max-w-sm bg-base-100 sm:mt-36">
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
  );
}
