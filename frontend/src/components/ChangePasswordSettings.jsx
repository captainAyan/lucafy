import axios from "axios";
import { useState } from "react";
import { CHANGE_PASSWORD_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import { useSelector } from "react-redux";

export default function ChangePasswordSettings() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const { oldPassword, newPassword, newPasswordConfirm } = formData;
  const [helperText, setHelperText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Save");

  const { token } = useSelector((state) => state.auth2);

  const onFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (newPassword === newPasswordConfirm) {
      setIsLoading(true);
      axios
        .put(
          CHANGE_PASSWORD_URL,
          { oldPassword, newPassword },
          authConfig(token)
        )
        .then(() => {
          setHelperText("");
          setButtonLabel("Saved 🎉");
        })
        .catch((error) => {
          setHelperText(error.response.data.error.message);
        })
        .finally(() => setIsLoading(false));
    } else setHelperText("New passwords don't match");
  };

  return (
    <div className="card w-full max-w-sm bg-base-100 mb-8">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-2xl font-bold">Change Password</h1>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Old Password</span>
          </label>
          <input
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={onFormChange}
            placeholder="Old Password"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={onFormChange}
            placeholder="New Password"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm New Password</span>
          </label>
          <input
            type="password"
            name="newPasswordConfirm"
            value={newPasswordConfirm}
            onChange={onFormChange}
            placeholder="Confirm New Password"
            className="input input-bordered"
          />
        </div>

        <p className="text-red-500 text-sm text-left">{helperText}</p>

        <div className="form-control mt-4">
          <button
            className={`btn btn-info text-white ${isLoading ? "loading" : ""}`}
            onClick={handleSubmit}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
