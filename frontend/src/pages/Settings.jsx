import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  RUPEE,
  DOLLAR,
  EURO,
  NAIRA,
  NEW_SHEKEL,
  POUND,
  RUBLE,
  TAKA,
  WON,
  YEN,
} from "../constants/currency";
import { INDIAN, INTERNATIONAL } from "../constants/amountFormat";

import { setPreference } from "../features/preference/preferenceSlice";
import {
  changePassword,
  deleteAccount,
  reset,
} from "../features/auth/authSlice";
import entryService from "../features/entry/entryService";

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const preference = useSelector((state) => state.preference);

  const [isNormalizeLoading, setIsNormalizeLoading] = useState(false);

  const [currencyPreferenceFormData, setCurrencyPreferenceFormData] = useState({
    amountFormat: preference.amountFormat,
    currency: preference.currency,
  });
  const { amountFormat, currency } = currencyPreferenceFormData;

  const [preferenceSaveButtonLabel, setPreferenceSaveButtonLabel] =
    useState("Save");

  /**
   * ⛔ The current implementation prevents us from handling the successes/errors
   * differently for different changes (i.e. normalization, password change etc,
   * are all handled in the similar way)
   *
   * This will be changed later
   */
  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess) {
      navigate("/");
    }

    if (!user) {
      navigate("/login");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChangeCurrencyForm = (e) => {
    setCurrencyPreferenceFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePreferenceSubmit = () => {
    const preference = {
      amountFormat,
      currency,
    };

    dispatch(setPreference(preference));
    setPreferenceSaveButtonLabel("Saved 🎉");
  };

  const handleDelete = () => {
    dispatch(deleteAccount());
  };

  const handleNormalize = async () => {
    setIsNormalizeLoading(true);
    await entryService.normalize(user?.token);
    setIsNormalizeLoading(false);
  };

  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const { oldPassword, newPassword, newPasswordConfirm } = passwordFormData;
  const [helperText, setHelperText] = useState("");

  const onChangePasswordForm = (e) => {
    setHelperText("");
    setPasswordFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordForm = () => {
    if (newPassword === newPasswordConfirm) {
      dispatch(changePassword({ oldPassword, newPassword }));
    } else setHelperText("New passwords don't match");
  };

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4 mb-8">
          <h1 className="text-4xl font-bold text-left">Settings</h1>
        </div>

        <div className="card w-full max-w-sm bg-base-100 mb-8">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-2xl font-bold">Preference</h1>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Currency Format</span>
              </label>
              <select
                className="select select-bordered"
                name="amountFormat"
                value={amountFormat}
                onChange={onChangeCurrencyForm}
              >
                <option value={INDIAN}>Indian</option>
                <option value={INTERNATIONAL}>International</option>
              </select>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Currency Name</span>
              </label>
              <select
                className="select select-bordered"
                name="currency"
                value={currency}
                onChange={onChangeCurrencyForm}
              >
                <option value={RUPEE}>Rupee (₹) 🇮🇳</option>
                <option value={DOLLAR}>Dollar ($) 🇺🇸 🇦🇺 🇨🇦 🇲🇽</option>
                <option value={EURO}>Euro (€) 🇪🇺</option>
                <option value={NAIRA}>Naira (₦) 🇳🇬</option>
                <option value={NEW_SHEKEL}>New Shekel (₪) 🇮🇱</option>
                <option value={POUND}>Pound (£) 🇬🇧</option>
                <option value={RUBLE}>Ruble (₽) 🇷🇺</option>
                <option value={TAKA}>Taka (৳) 🇧🇩</option>
                <option value={WON}>Won (₩) 🇰🇷</option>
                <option value={YEN}>Yen (¥) 🇯🇵 🇨🇳</option>
              </select>
            </div>
            <div className="form-control mt-4">
              <button
                className="btn bg-green-500 text-white"
                onClick={handlePreferenceSubmit}
              >
                {preferenceSaveButtonLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="card w-full max-w-sm bg-base-100 mb-8">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-2xl font-bold">Delete Account</h1>
            </div>

            <p className="text-justify text-xs mt-2">
              ⚠️ Once deleted, your account can not be recovered.
            </p>
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

        <div className="card w-full max-w-sm bg-base-100 mb-8">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-2xl font-bold">Normalization</h1>
            </div>

            <p className="text-justify text-xs mt-2">
              The maximum number of entries you can create is 100. Once that
              limit is reached, you can still utilize this application by{" "}
              <i>Normalization</i> of the entries.
            </p>
            <p className="text-justify text-xs">
              Normalization will get rid of all the individual entries, and
              store the current ledger balances into the system. Upon creation
              of new entries, the ledger balance will be computed by taking into
              account the stored normalized balances and as usual, the entries.
            </p>

            <p className="text-justify text-xs">
              <b>Pros :</b>
              <li>
                Use the app even though the limit of 100 entries has been
                reached.
              </li>
              <li>No loss in accuracy of the balances.</li>
            </p>

            <p className="text-justify text-xs">
              <b>Cons :</b>
              <li>
                Old transaction details won't be displayed in the journal.{" "}
                <i>
                  (You can still export a report of all the transaction
                  available at that time)
                </i>
              </li>
              <li>
                Activities occurred before normalization will not show up in the
                activity heatmap.
              </li>
            </p>

            <p className="text-justify text-xs">
              <b>Note: </b>It's a good idea to export a report before
              normalizing the accounts, so that you don't lose old transaction
              details.
            </p>

            <button
              className={`btn bg-yellow-500 text-white w-full mt-4 ${
                isNormalizeLoading ? "loading" : ""
              }`}
              onClick={handleNormalize}
            >
              Normalize
            </button>
          </div>
        </div>

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
                onChange={onChangePasswordForm}
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
                onChange={onChangePasswordForm}
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
                onChange={onChangePasswordForm}
                placeholder="Confirm New Password"
                className="input input-bordered"
              />
            </div>

            <p className="text-red-500 text-sm text-left">{helperText}</p>

            <div className="form-control mt-4">
              <button
                className={`btn btn-info text-white ${
                  isLoading ? "loading" : ""
                }`}
                onClick={handlePasswordForm}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
