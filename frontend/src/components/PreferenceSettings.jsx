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
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function PreferenceSettings() {
  const dispatch = useDispatch();
  const preference = useSelector((state) => state.preference);

  const [formData, setFormData] = useState({
    amountFormat: preference.amountFormat,
    currency: preference.currency,
  });
  const { amountFormat, currency } = formData;

  const [buttonLabel, setButtonLabel] = useState("Save");

  const onFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const preference = { amountFormat, currency };

    dispatch(setPreference(preference));
    setButtonLabel("Saved 🎉");
  };

  return (
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
            onChange={onFormChange}
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
            onChange={onFormChange}
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
            onClick={handleSubmit}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
