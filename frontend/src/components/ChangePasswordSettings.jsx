import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Formik, Form, ErrorMessage, Field } from "formik";

import { CHANGE_PASSWORD_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import { ChangePasswordSchema } from "../util/userValidationSchema";

export default function ChangePasswordSettings() {
  const initialFormData = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  const [helperText, setHelperText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Save");

  const { token } = useSelector((state) => state.auth);

  const handleSubmit = (data, formResetFn) => {
    const { oldPassword, newPassword } = data;
    setIsLoading(true);
    axios
      .put(CHANGE_PASSWORD_URL, { oldPassword, newPassword }, authConfig(token))
      .then(() => {
        setHelperText("");
        setButtonLabel("Saved 🎉");
        formResetFn();
      })
      .catch((error) => setHelperText(error.response.data.error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="card w-full max-w-sm bg-base-100 mb-8">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-2xl font-bold">Change Password</h1>
        </div>

        <Formik
          initialValues={initialFormData}
          validationSchema={ChangePasswordSchema}
          onSubmit={async (values, { resetForm }) =>
            handleSubmit(values, resetForm)
          }
        >
          <Form>
            <div className="form-control">
              <label className="label" htmlFor="oldPassword">
                <span className="label-text">Old Password</span>
              </label>
              <Field
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                className="input input-bordered"
              />
              <span className="text-red-500 text-sm text-left">
                <ErrorMessage name="oldPassword" />
              </span>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="newPassword">
                <span className="label-text">New Password</span>
              </label>
              <Field
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="input input-bordered"
              />
              <span className="text-red-500 text-sm text-left">
                <ErrorMessage name="newPassword" />
              </span>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="confirmNewPassword">
                <span className="label-text">Confirm New Password</span>
              </label>
              <Field
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                className="input input-bordered"
              />
              <span className="text-red-500 text-sm text-left">
                <ErrorMessage name="confirmNewPassword" />
              </span>
            </div>

            <p className="text-red-500 text-sm text-left">{helperText}</p>

            <div className="form-control mt-4">
              <button
                className={`btn btn-info text-white ${
                  isLoading ? "loading" : ""
                }`}
                type="submit"
              >
                {buttonLabel}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
