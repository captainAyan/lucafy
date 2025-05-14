import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";

import { useAllLedgerDataHook } from "../hooks/useLedgerDataHook";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function SelectLedger() {
  const { token } = useSelector((state) => state.auth);

  const { isLoading, error, isSuccess, isError, data } =
    useAllLedgerDataHook(token);

  const [ledgers, setLedgers] = useState([]);

  useEffect(() => {
    setLedgers(data?.data?.ledgers);
  }, [data, isSuccess]);

  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Select Ledger</h1>

      <div className="bg-white rounded-xl">
        {/* Loading view */}
        {isLoading && <h1 className="text-xl text-center py-8">Loading...</h1>}
        {/* Error view */}
        {isError && (
          <div className="text-red-500">
            <h1 className="text-4xl text-center pt-8">😢</h1>
            <h1 className="text-xl text-center pt-4 pb-2">
              There was an error.
            </h1>
            <p className="text-sm text-center pb-8">
              {error?.response?.data?.error?.message}
            </p>
          </div>
        )}

        {/* Ledger selection */}
        {data && !isLoading && (
          <Formik
            enableReinitialize={true}
            initialValues={{
              ledger: ledgers?.at(0)?.id,
            }}
            onSubmit={(values) => {
              navigate(`/ledger/${values.ledger}`);
            }}
          >
            <Form>
              <div className="p-4 flex">
                <div className="flex items-center h-12">
                  <label
                    htmlFor="ledger"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ledger
                  </label>
                  <Field
                    as="select"
                    name="ledger"
                    className="h-full ms-2 px-2 capitalize border border-gray-300 rounded-lg shadow-xs focus:outline-none focus:ring-4 ring-indigo-200 text-sm hover:cursor-pointer duration-300"
                  >
                    {ledgers?.map((ledger) => (
                      <option
                        value={ledger.id}
                        key={ledger.id}
                        className="capitalize"
                      >
                        {ledger.name} A/c
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="flex items-center h-12 ms-4">
                  <Button
                    type="submit"
                    className="h-full px-4"
                    variant="secondary"
                    isLoading={isLoading}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Form>
          </Formik>
        )}
      </div>
    </>
  );
}
