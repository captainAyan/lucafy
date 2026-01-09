import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { EDIT_PROFILE_URL } from "../constants/api";
import authConfig from "../util/authConfig";

import { updateUser } from "../features/auth/authSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ProfileSchema } from "../util/userValidationSchema";

export default function EditProfile() {
  const { user, token } = useSelector((state) => state.auth);

  const initialFormData = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  };

  /**
   * Following is the code for fixing an uncontrolled input error, that appeared
   * after using enableReinitialize prop on Formik component.
   *
   * Solution Link:
   * https://github.com/jaredpalmer/formik/issues/811#issuecomment-1059814695
   */
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(index + 1);
  }, [user]);

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

  const handleSubmit = (userData) => {
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

            <Formik
              key={index}
              initialValues={initialFormData}
              enableReinitialize
              validationSchema={ProfileSchema}
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

                  <p className="text-red-500 text-sm text-left">{helperText}</p>

                  <div className="form-control mt-4">
                    <button
                      className={`btn btn-primary ${
                        isLoading ? "loading" : ""
                      }`}
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </center>
    </div>
  );
}
