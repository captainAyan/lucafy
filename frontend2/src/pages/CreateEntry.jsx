import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";

import Input from "../components/form/Input";
import Textarea from "../components/form/Textarea";
import SelectInput from "../components/form/SelectInput";
import Button from "../components/Button";
import { useAllLedgerDataHook } from "../hooks/useLedgerDataHook";
import { ENTRY_NARRATION_MAX_LENGTH } from "../constants/policies";
import { EntryCreateSchema } from "../util/entryValidationSchema";

export default function CreateEntry() {
  const { token } = useSelector((state) => state.auth);

  const { isLoading, error, isSuccess, isError, data } =
    useAllLedgerDataHook(token);

  const [ledgers, setLedgers] = useState([]);

  useEffect(() => {
    setLedgers(data?.data?.ledgers);
  }, [data, isSuccess]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Create Entry</h1>

      <div className="bg-white rounded-xl mb-4">
        <div className="p-4">
          <Formik
            enableReinitialize={true}
            validationSchema={EntryCreateSchema}
            initialValues={{
              debit_ledger_id: ledgers?.at(0)?.id,
              credit_ledger_id: ledgers?.at(0)?.id,
              amount: 0,
              narration: "",
            }}
            onSubmit={async (values) => console.log(values)}
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
                      placeholder="New narration"
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
                <Button
                  type="submit"
                  className="h-12 w-auto px-4 mt-2"
                  // isLoading={isSavingEdit}
                >
                  Save
                </Button>

                <Button
                  type="reset"
                  className="h-12 w-auto px-4 mt-2 ms-4"
                  variant="secondary"
                  // isLoading={isSavingEdit}
                >
                  Reset
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
