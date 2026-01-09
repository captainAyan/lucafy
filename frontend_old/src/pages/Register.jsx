import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { register } from "../features/auth/authSlice";
import axios from "axios";
import { REGISTER_URL } from "../constants/api";
import { RegisterSchema } from "../util/userValidationSchema";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState();
  const [errorData, setErrorData] = useState();

  const [helperText, setHelperText] = useState("");

  const { token, user } = useSelector((state) => state.auth);

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

  const handleSubmit = (userData) => {
    const { confirmPassword, ...actualUserData } = userData;

    setIsLoading(true);
    axios
      .post(REGISTER_URL, actualUserData)
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
              <h1 className="text-4xl font-bold">Register</h1>
            </div>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values) => handleSubmit(values)}
            >
              {() => (
                <Form>
                  <div className="form-control">
                    <label className="label" htmlFor="firstName">
                      <span className="label-text">First Name</span>
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="input input-bordered"
                      autoFocus
                    />
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="firstName" />
                    </span>
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="lastName">
                      <span className="label-text">Last Name</span>
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="input input-bordered"
                    />
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="lastName" />
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="email">
                      <span className="label-text">Email</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="input input-bordered"
                    />
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="email" />
                    </span>
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="password">
                      <span className="label-text">Password</span>
                    </label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="input input-bordered"
                    />
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="password" />
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="confirmPassword">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="input input-bordered mt-2"
                    />
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="confirmPassword" />
                    </span>
                  </div>

                  <p className="text-red-500 text-sm text-left">{helperText}</p>

                  <div className="form-control mt-4">
                    <button
                      className={`btn btn-primary ${
                        isLoading ? "loading" : ""
                      }`}
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

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
