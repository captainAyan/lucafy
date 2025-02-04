import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import axios from "axios";

import { login } from "../features/authSlice";
import { LOGIN_URL } from "../constants/api";
import { LoginSchema } from "../util/userValidationSchema";
import { Button, Input } from "../components/Form";

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
    <div className="bg-white rounded-xl p-8 w-full">
      <h1 className="text-4xl font-bold">Login</h1>
      <div className="mt-4">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => handleSubmit(values)}
        >
          <Form>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              autofocus
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
            />

            <span className="inline-block text-sm py-2 mt-1 text-red-500">
              {helperText}
            </span>

            <Button
              type="submit"
              variant="primary"
              className="mt-4"
              isLoading={isLoading}
            >
              Login
            </Button>
          </Form>
        </Formik>
        <Link to="/register">
          <Button className="mt-2" variant="secondary">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
