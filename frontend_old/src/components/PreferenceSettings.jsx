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
import { ErrorMessage, Field, Form, Formik } from "formik";
import PreferenceSchema from "../util/preferenceValidationSchema";

export default function PreferenceSettings() {
  const dispatch = useDispatch();
  const preference = useSelector((state) => state.preference);

  const initialFormData = {
    amountFormat: preference.amountFormat,
    currency: preference.currency,
  };

  const [buttonLabel, setButtonLabel] = useState("Save");

  const handleSubmit = (values) => {
    const { amountFormat, currency } = values;
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

        <Formik
          initialValues={initialFormData}
          validationSchema={PreferenceSchema}
          onSubmit={async (values) => handleSubmit(values)}
        >
          <Form>
            <div className="form-control w-full max-w-xs">
              <label className="label" htmlFor="amountFormat">
                <span className="label-text">Currency Format</span>
              </label>
              <Field
                as="select"
                className="select select-bordered"
                name="amountFormat"
              >
                <option value={INDIAN}>Indian</option>
                <option value={INTERNATIONAL}>International</option>
              </Field>
              <span className="text-red-500 text-sm text-left">
                <ErrorMessage name="amountFormat" />
              </span>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label" htmlFor="currency">
                <span className="label-text">Currency Name</span>
              </label>
              <Field
                as="select"
                className="select select-bordered"
                name="currency"
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
              </Field>
              <span className="text-red-500 text-sm text-left">
                <ErrorMessage name="currency" />
              </span>
            </div>
            <div className="form-control mt-4">
              <button className="btn bg-green-500 text-white" type="submit">
                {buttonLabel}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
