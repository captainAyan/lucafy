import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";

import { login } from "../features/auth/authSlice";
import axios from "axios";
import { LOGIN_URL } from "../constants/api";
import { LoginSchema } from "../util/userValidationSchema";

export default function Login() {
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
      dispatch(login(responseData));
    }

    if (token && user) {
      navigate("/");
    }
  }, [user, token, errorData, responseData, navigate, dispatch]);

  const handleSubmit = (userData) => {
    setIsLoading(true);
    axios
      .post(LOGIN_URL, userData)
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
              <h1 className="text-4xl font-bold">Login</h1>
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={async (values) => handleSubmit(values)}
            >
              <Form>
                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered"
                    autoFocus
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

                <p className="text-red-500 text-sm text-left">{helperText}</p>

                <div className="form-control mt-4">
                  <button
                    className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </Form>
            </Formik>

            <div className="form-control mt-2">
              <Link to="/register" className="btn btn-outline btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
