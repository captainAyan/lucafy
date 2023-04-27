import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";

import { useAddEntryHook } from "../hooks/useEntryDataHook";
import MiniLoading from "../components/MiniLoading";
import { useAllLedgerDataHook } from "../hooks/useLedgerDataHook";
import Alert from "../components/Alert";
import { ENTRY_NARRATION_MAX_LENGTH } from "../constants/policies";
import { EntryCreateSchema } from "../util/entryValidationSchema";

export default function CreateEntry() {
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (data) => {
    addEntry(data);
  };

  const {
    mutate: addEntry,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useAddEntryHook(token);

  const {
    isLoading: isFetching,
    error: fetchingError,
    isError: isFetchingError,
    data: fetchedData,
  } = useAllLedgerDataHook(token);

  const initialFormData = {
    debit_ledger_id: fetchedData?.data?.ledgers[0]?.id, // default
    credit_ledger_id: fetchedData?.data?.ledgers[0]?.id, // default
    amount: 0,
    narration: "",
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
    /**
     * This should run on the first fetch only.
     *
     * On the event of the user leaving window and then coming back, the
     * reactQuery refetches the data, which triggers this useEffect.
     *
     * We Don't want this to happen, as it resets the form.
     */
    if (index === 0) setIndex(index + 1);
  }, [fetchedData]);

  /**
   * Changing the key will reset the form, therefore we're increasing the key on
   * every successful submit.
   */
  useEffect(() => {
    if (isSuccess) setIndex(index + 1);
  }, [isSuccess]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Create Entry</h1>
            </div>

            {isFetchingError && (
              <Alert message={fetchingError?.response?.data?.error?.message} />
            )}

            <Formik
              key={index}
              initialValues={initialFormData}
              validationSchema={EntryCreateSchema}
              onSubmit={async (values) => handleSubmit(values)}
            >
              {({ values }) => (
                <Form>
                  <div className="form-control">
                    <label className="label" htmlFor="debit_ledger_id">
                      <span className="label-text">Debit</span>
                      {isFetching ? <MiniLoading /> : null}
                    </label>
                    <Field
                      as="select"
                      className="select select-bordered capitalize"
                      name="debit_ledger_id"
                      autoFocus
                    >
                      {fetchedData?.data?.ledgers?.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name} A/c
                          </option>
                        );
                      })}
                    </Field>
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="debit_ledger_id" />
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="credit_ledger_id">
                      <span className="label-text">Credit</span>
                    </label>
                    <Field
                      as="select"
                      className="select select-bordered capitalize"
                      name="credit_ledger_id"
                    >
                      {fetchedData?.data?.ledgers?.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name} A/c
                          </option>
                        );
                      })}
                    </Field>
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="credit_ledger_id" />
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="amount">
                      <span className="label-text">Amount</span>
                    </label>
                    <Field
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered"
                      name="amount"
                    />
                    <span className="text-red-500 text-sm text-left">
                      <ErrorMessage name="amount" />
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label" htmlFor="narration">
                      <span className="label-text">Narration</span>
                    </label>
                    <Field
                      as="textarea"
                      className="textarea textarea-bordered"
                      placeholder="Narration"
                      name="narration"
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
