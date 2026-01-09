import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";

import Input from "../components/form/Input";
import Textarea from "../components/form/Textarea";
import SelectInput from "../components/form/SelectInput";
import Button from "../components/Button";
import { useAddEntryHook } from "../hooks/useEntryDataHook";
import { useAllLedgerDataHook } from "../hooks/useLedgerDataHook";
import { ENTRY_NARRATION_MAX_LENGTH } from "../constants/policies";
import { EntryCreateSchema } from "../util/entryValidationSchema";

export default function CreateEntry() {
  const { token } = useSelector((state) => state.auth);

  const allLedgersFetching = useAllLedgerDataHook(token);
  const [ledgers, setLedgers] = useState([]);
  useEffect(() => {
    if (allLedgersFetching.isSuccess)
      setLedgers(allLedgersFetching?.data?.data?.ledgers);
  }, [allLedgersFetching?.data, allLedgersFetching?.isSuccess]);

  const addEntry = useAddEntryHook(token);

  const notifyEntrySaveSuccess = () => toast.success("Entry saved");
  const notifyEntrySaveError = () => toast.error("Cannot save entry");

  useEffect(() => {
    if (addEntry?.isSuccess) notifyEntrySaveSuccess();
    if (addEntry?.isError) notifyEntrySaveError();
  }, [addEntry?.isSuccess, addEntry?.isError]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Create Entry</h1>

      <div className="bg-white rounded-xl p-4">
        {/* Loading view */}
        {allLedgersFetching?.isLoading && (
          <h1 className="text-xl text-center">Loading...</h1>
        )}
        {/* Error view */}
        {allLedgersFetching?.isError && (
          <div className="text-red-500">
            <h1 className="text-4xl text-center pt-8">😢</h1>
            <h1 className="text-xl text-center pt-4 pb-2">
              There was an error.
            </h1>
            <p className="text-sm text-center pb-8">
              {allLedgersFetching?.isError &&
                allLedgersFetching?.error?.response?.data?.error?.message}
            </p>
          </div>
        )}

        {allLedgersFetching?.data && (
          <Formik
            enableReinitialize={true}
            validationSchema={EntryCreateSchema}
            initialValues={{
              debit_ledger_id: ledgers?.at(0)?.id,
              credit_ledger_id: ledgers?.at(0)?.id,
              amount: 0,
              narration: "",
            }}
            onSubmit={async (values, { resetForm }) => {
              addEntry.mutate(values);
              resetForm();
            }}
          >
            {({ values }) => (
              <Form>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2">
                  <SelectInput
                    label="Debit Ledger"
                    name="debit_ledger_id"
                    autofocus={true}
                    inputClassName="capitalize"
                  >
                    {ledgers?.map((ledger) => (
                      <option value={ledger.id} key={ledger.id}>
                        {ledger.name} A/c
                      </option>
                    ))}
                  </SelectInput>

                  <SelectInput
                    label="Credit Ledger"
                    name="credit_ledger_id"
                    inputClassName="capitalize"
                  >
                    {ledgers?.map((ledger) => (
                      <option value={ledger.id} key={ledger.id}>
                        {ledger.name} A/c
                      </option>
                    ))}
                  </SelectInput>

                  <Input
                    label="Amount"
                    type="number"
                    name="amount"
                    placeholder="Amount"
                  />

                  <div>
                    <Textarea
                      label="Narration"
                      placeholder="Narration"
                      name="narration"
                    />
                    <span
                      className={`text-sm ${
                        values?.narration?.length > ENTRY_NARRATION_MAX_LENGTH
                          ? "text-red-500"
                          : null
                      }`}
                    >
                      ({values?.narration?.length}/{ENTRY_NARRATION_MAX_LENGTH})
                    </span>
                  </div>
                </div>

                <p className="text-red-500 text-sm text-left">
                  {addEntry?.isError &&
                    addEntry?.error?.response?.data?.error?.message}
                </p>

                <Button
                  type="submit"
                  className="h-12 w-auto px-4 mt-2"
                  isLoading={addEntry.isPending}
                >
                  {addEntry?.isSuccess
                    ? "Saved 🎉"
                    : addEntry?.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>

                <Button
                  type="reset"
                  className="h-12 w-auto px-4 mt-2 ms-4"
                  variant="secondary"
                >
                  Reset
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
}
