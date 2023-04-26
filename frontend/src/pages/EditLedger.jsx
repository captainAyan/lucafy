import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";

import MiniLoading from "../components/MiniLoading";
import Alert from "../components/Alert";
import {
  useEditLedgerHook,
  useLedgerDataHook,
} from "../hooks/useLedgerDataHook";
import LedgerSchema from "../util/ledgerValidationSchema";
import {
  ASSET,
  EQUITY,
  EXPENDITURE,
  INCOME,
  LIABILITY,
} from "../constants/ledgerTypes";
import { LEDGER_DESCRIPTION_MAX_LENGTH } from "../constants/policies";

export default function EditLedger() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const {
    mutate: editLedger,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useEditLedgerHook(token, id);

  const {
    isLoading: isFetching,
    error: fetchingError,
    isError: isFetchingError,
    data: fetchedData,
  } = useLedgerDataHook(token, id);

  const initialFormData = {
    name: fetchedData?.data?.name,
    type: fetchedData?.data?.type,
    description: fetchedData?.data?.description,
  };

  const handleSubmit = async (data) => {
    editLedger(data);
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
              <h1 className="text-4xl font-bold">Edit Ledger</h1>
            </div>

            {isFetchingError && (
              <Alert message={fetchingError?.response?.data?.error?.message} />
            )}

            <h1 className="text-2xs font-thin break-all uppercase text-justify">
              #{id}
            </h1>

            <Formik
              key={index}
              initialValues={initialFormData}
              enableReinitialize
              validationSchema={LedgerSchema}
              onSubmit={async (values) => handleSubmit(values)}
            >
              {({ values }) => (
                <Form>
                  <div className="form-control">
                    <label className="label" htmlFor="name">
                      <span className="label-text">Name</span>

                      {isFetching ? <MiniLoading /> : null}
                    </label>
                    <Field
                      type="text"
                      placeholder="Name"
                      className="input input-bordered"
                      name="name"
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
                          values?.description?.length >
                          LEDGER_DESCRIPTION_MAX_LENGTH
                            ? "text-red-500"
                            : null
                        }`}
                      >
                        ({values?.description?.length}/
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
