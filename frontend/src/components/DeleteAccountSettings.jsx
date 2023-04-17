import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_PROFILE_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import { logout } from "../features/auth/authSlice2";

export default function DeleteAccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [helperText, setHelperText] = useState("");

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth2);

  const handleDelete = async () => {
    setIsLoading(true);
    axios
      .delete(DELETE_PROFILE_URL, authConfig(token))
      .then(() => {
        setHelperText("");
        localStorage.setItem("token", "");
        dispatch(logout());
      })
      .catch((error) => {
        setHelperText(error.response.data.error.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="card w-full max-w-sm bg-base-100 mb-8">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-2xl font-bold">Delete Account</h1>
        </div>

        <p className="text-justify text-xs mt-2">
          ⚠️ Once deleted, your account can not be recovered.
        </p>

        <p className="text-red-500 text-sm text-left">{helperText}</p>

        <button
          className={`btn bg-red-500 text-white w-full mt-4 ${
            isLoading ? "loading" : ""
          }`}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
