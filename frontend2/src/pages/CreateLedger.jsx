import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";

import {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} from "../constants/ledgerTypes";
import Input from "../components/form/Input";
import Textarea from "../components/form/Textarea";
import SelectInput from "../components/form/SelectInput";
import Button from "../components/Button";
import { useAddLedgerHook } from "../hooks/useLedgerDataHook";
import { LEDGER_DESCRIPTION_MAX_LENGTH } from "../constants/policies";
import LedgerSchema from "../util/ledgerValidationSchema";

export default function CreateELedger() {
  const { token } = useSelector((state) => state.auth);

  const addLedger = useAddLedgerHook(token);

  const notifyLedgerSaveSuccess = () => toast.success("Ledger saved");
  const notifyLedgerSaveError = () => toast.error("Cannot save ledger");

  useEffect(() => {
    if (addLedger?.isSuccess) notifyLedgerSaveSuccess();
    if (addLedger?.isError) notifyLedgerSaveError();
  }, [addLedger?.isSuccess, addLedger?.isError]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Create Entry</h1>

      <div className="bg-white rounded-xl mb-4">
        <div className="p-4">
          <Formik
            enableReinitialize={true}
            validationSchema={LedgerSchema}
            initialValues={{
              name: "",
              type: ASSET,
              description: "",
            }}
            onSubmit={async (values, { resetForm }) => {
              addLedger.mutate(values);
              resetForm();
            }}
          >
            {({ values }) => (
              <Form>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2">
                  <Input
                    label="Name"
                    type="text"
                    name="name"
                    placeholder="Name"
                  />

                  <SelectInput label="Type" name="type">
                    <option value={ASSET}>Asset</option>
                    <option value={LIABILITY}>Liability</option>
                    <option value={INCOME}>Income</option>
                    <option value={EXPENDITURE}>Expenditure</option>
                    <option value={EQUITY}>Equity</option>
                  </SelectInput>

                  <div>
                    <Textarea
                      label="Description"
                      placeholder="Description"
                      name="description"
                    />
                    <span
                      className={`text-sm ${
                        values?.narration?.length >
                        LEDGER_DESCRIPTION_MAX_LENGTH
                          ? "text-red-500"
                          : null
                      }`}
                    >
                      ({values?.description?.length}/
                      {LEDGER_DESCRIPTION_MAX_LENGTH})
                    </span>
                  </div>
                </div>

                <p className="text-red-500 text-sm text-left">
                  {addLedger?.isError &&
                    addLedger?.error?.response?.data?.error?.message}
                </p>

                <Button
                  type="submit"
                  className="h-12 w-auto px-4 mt-2"
                  isLoading={addLedger.isPending}
                >
                  {addLedger?.isSuccess
                    ? "Saved 🎉"
                    : addLedger?.isPending
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
        </div>
      </div>
    </>
  );
}
