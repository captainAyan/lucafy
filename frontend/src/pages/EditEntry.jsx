import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";

import MiniLoading from "../components/MiniLoading";
import { useEditEntryHook, useEntryDataHook } from "../hooks/useEntryDataHook";
import Alert from "../components/Alert";
import { ENTRY_NARRATION_MAX_LENGTH } from "../constants/policies";
import { EntryEditSchema } from "../util/entryValidationSchema";

export default function EditEntry() {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const handleSubmit = async (data) => {
    editEntry(data);
  };

  const {
    mutate: editEntry,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useEditEntryHook(token, id);

  const {
    isLoading: isFetching,
    error: fetchingError,
    isError: isFetchingError,
    data: fetchedData,
  } = useEntryDataHook(token, id);

  const initialFormData = {
    narration: fetchedData?.data?.narration,
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
  }, [fetchedData]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Edit Entry</h1>
            </div>

            {isFetchingError && (
              <Alert message={fetchingError?.response?.data?.error?.message} />
            )}

            <h1 className="text-2xs font-thin break-all text-justify uppercase">
              #{id}
            </h1>

            <Formik
              key={index}
              initialValues={initialFormData}
              enableReinitialize
              validationSchema={EntryEditSchema}
              onSubmit={async (values) => handleSubmit(values)}
            >
              {({ values }) => (
                <Form>
                  <div className="form-control">
                    <label className="label" htmlFor="narration">
                      <span className="label-text">Narration</span>

                      {isFetching ? <MiniLoading /> : null}
                    </label>
                    <Field
                      as="textarea"
                      className="textarea textarea-bordered"
                      placeholder="Narration"
                      name="narration"
                      autoFocus
                    ></Field>
                    <label className="label">
                      <span
                        className={`label-text-alt ${
                          values?.narration?.length > ENTRY_NARRATION_MAX_LENGTH
                            ? "text-red-500"
                            : null
                        }`}
                      >
                        ({values?.narration?.length}/
                        {ENTRY_NARRATION_MAX_LENGTH})
                      </span>
                    </label>
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="narration" />
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
