import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";

import {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} from "../constants/ledgerTypes";
import { useAddLedgerHook } from "../hooks/useLedgerDataHook";
import LedgerSchema from "../util/ledgerValidationSchema";
import { LEDGER_DESCRIPTION_MAX_LENGTH } from "../constants/policies";

export default function CreateLedger() {
  const { token } = useSelector((state) => state.auth);

  const initialFormData = {
    name: "",
    type: ASSET,
    description: "",
  };

  const handleSubmit = (data) => {
    addLedger(data);
  };

  const {
    mutate: addLedger,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useAddLedgerHook(token);

  /**
   * Changing the key will reset the form, therefore we're increasing the key on
   * every successful submit.
   */
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (isSuccess) setIndex(index + 1);
  }, [isSuccess]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Create Ledger</h1>
            </div>

            <Formik
              key={index}
              initialValues={initialFormData}
              validationSchema={LedgerSchema}
              onSubmit={async (values) => handleSubmit(values)}
            >
              {({ values }) => (
                <Form>
                  <div className="form-control">
                    <label className="label" htmlFor="name">
                      <span className="label-text">Name</span>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="input input-bordered"
                      autoFocus
                    />
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="name" />
                    </span>
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="type">
                      <span className="label-text">Type</span>
                    </label>
                    <Field
                      as="select"
                      className="select select-bordered"
                      name="type"
                    >
                      <option value={ASSET}>Asset</option>
                      <option value={LIABILITY}>Liability</option>
                      <option value={INCOME}>Income</option>
                      <option value={EXPENDITURE}>Expenditure</option>
                      <option value={EQUITY}>Equity</option>
                    </Field>
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="type" />
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="description">
                      <span className="label-text">Description</span>
                    </label>
                    <Field
                      as="textarea"
                      className="textarea textarea-bordered"
                      placeholder="Description"
                      name="description"
                    ></Field>
                    <label className="label">
                      <span
                        className={`label-text-alt ${
                          values.description.length >
                          LEDGER_DESCRIPTION_MAX_LENGTH
                            ? "text-red-500"
                            : null
                        }`}
                      >
                        ({values.description.length}/
                        {LEDGER_DESCRIPTION_MAX_LENGTH})
                      </span>
                    </label>
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="description" />
                    </span>
                  </div>

                  <p className="text-red-500 text-sm text-left">
                    {isError && error?.response?.data?.error?.message}
                  </p>

                  <div className="form-control mt-2">
                    <button
                      className={`btn btn-primary ${
                        isLoading ? "loading" : ""
                      }`}
                      type="submit"
                    >
                      {isSuccess ? "Saved 🎉" : "Save"}
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
