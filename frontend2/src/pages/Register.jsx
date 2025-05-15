import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import axios from "axios";

import { register } from "../features/authSlice";
import { REGISTER_URL } from "../constants/api";
import { RegisterSchema } from "../util/userValidationSchema";
import Button from "../components/Button";
import Input from "../components/form/Input";

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
    <main className="h-full flex">
      <div className="m-auto w-96">
        <div className="bg-white rounded-xl p-8 w-full">
          <h1 className="text-4xl font-bold">Register</h1>
          <div className="mt-4">
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
              <Form>
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  autofocus
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Email"
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />

                <span className="inline-block text-sm py-2 mt-1 text-red-500">
                  {helperText}
                </span>

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-4 h-12 w-full"
                  isLoading={isLoading}
                >
                  Register
                </Button>
              </Form>
            </Formik>

            <Link to="/login">
              <Button className="mt-2 h-12 w-full" variant="secondary">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
