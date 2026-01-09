import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

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
import {
  useEditLedgerHook,
  useLedgerDataHook,
} from "../hooks/useLedgerDataHook";
import { LEDGER_DESCRIPTION_MAX_LENGTH } from "../constants/policies";
import LedgerSchema from "../util/ledgerValidationSchema";
import Time from "../components/Time";

export default function CreateELedger() {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [ledger, setLedger] = useState({});

  const ledgerData = useLedgerDataHook(token, id);

  useEffect(() => {
    if (ledgerData?.isSuccess) setLedger(ledgerData?.data?.data);
  }, [ledgerData?.data, ledgerData?.isSuccess]);

  const editLedger = useEditLedgerHook(token, id);

  const notifyLedgerSaveSuccess = () => toast.success("Update saved");
  const notifyLedgerSaveError = () => toast.error("Cannot update ledger");

  useEffect(() => {
    if (editLedger?.isSuccess) notifyLedgerSaveSuccess();
    if (editLedger?.isError) notifyLedgerSaveError();
  }, [editLedger?.isSuccess, editLedger?.isError]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Edit Ledger</h1>

      <div className="bg-white rounded-xl p-4">
        {/* Loading view */}
        {ledgerData?.isLoading && (
          <h1 className="text-xl text-center">Loading...</h1>
        )}
        {/* Error view */}
        {ledgerData?.isError && (
          <div className="text-red-500">
            <h1 className="text-4xl text-center pt-8">😢</h1>
            <h1 className="text-xl text-center pt-4 pb-2">
              There was an error.
            </h1>
            <p className="text-sm text-center pb-8">
              {ledgerData?.isError &&
                ledgerData?.error?.response?.data?.error?.message}
            </p>
          </div>
        )}

        {ledgerData?.data && (
          <Formik
            enableReinitialize={true}
            validationSchema={LedgerSchema}
            initialValues={{
              name: ledger.name || "",
              type: ledger.type || ASSET,
              description: ledger.description || "",
            }}
            onSubmit={async (values) => {
              editLedger.mutate(values);
            }}
          >
            {({ values }) => (
              <Form>
                <p className="text-sm break-all uppercase">
                  <Link
                    to={`/ledger/${id}`}
                    className="link text-blue-500 font-mono hover:underline"
                  >
                    <span>#{id}</span>
                  </Link>

                  {/* <span className="font-mono">#{ledger?.id}</span> */}
                  <span className="ml-2">
                    <Time time={ledger?.created_at} />
                  </span>
                </p>

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
                        values?.description?.length >
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
                  {editLedger?.isError &&
                    editLedger?.error?.response?.data?.error?.message}
                </p>

                <Button
                  type="submit"
                  className="h-12 w-auto px-4 mt-2"
                  isLoading={editLedger.isPending}
                >
                  {editLedger?.isSuccess
                    ? "Saved 🎉"
                    : editLedger?.isPending
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
