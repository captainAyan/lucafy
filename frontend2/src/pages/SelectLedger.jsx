import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";

import { useAllLedgerDataHook } from "../hooks/useLedgerDataHook";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import FilterSelectInput from "../components/form/FilterSelectInput";

export default function SelectLedger() {
  const { token } = useSelector((state) => state.auth);

  const { isLoading, error, isSuccess, isError, data } =
    useAllLedgerDataHook(token);

  const [ledgers, setLedgers] = useState([]);

  useEffect(() => {
    if (isSuccess) setLedgers(data?.data?.ledgers);
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
              {isError && error?.response?.data?.error?.message}
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
                <FilterSelectInput
                  name="ledger"
                  label="Ledger"
                  className="h-12"
                  inputClassName="capitalize"
                >
                  {ledgers?.map((ledger) => (
                    <option value={ledger.id} key={ledger.id}>
                      {ledger.name} A/c
                    </option>
                  ))}
                </FilterSelectInput>

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
