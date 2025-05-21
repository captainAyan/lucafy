import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";

import { useEditEntryHook, useEntryDataHook } from "../hooks/useEntryDataHook";
import Entry from "../components/Entry";
import Button from "../components/Button";
import Textarea from "../components/form/Textarea";
import { ENTRY_NARRATION_MAX_LENGTH } from "../constants/policies";
import { EntryEditSchema } from "../util/entryValidationSchema";

export default function ViewEntry() {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [entry, setEntry] = useState({});

  const entryData = useEntryDataHook(token, id);

  useEffect(() => {
    if (entryData?.isSuccess) setEntry(entryData?.data?.data);
  }, [entryData?.data, entryData?.isSuccess]);

  const [isEditMode, setIsEditMode] = useState(false);
  const editEntry = useEditEntryHook(token, id);

  useEffect(() => {
    if (editEntry?.isSuccess) setEntry(editEntry?.data?.data);
  }, [editEntry?.data, editEntry?.isSuccess]);

  const notifyEntrySaveSuccess = () => toast.success("Update saved");
  const notifyEntrySaveError = () => toast.error("Cannot update entry");

  useEffect(() => {
    if (editEntry?.isSuccess) notifyEntrySaveSuccess();
    if (editEntry?.isError) notifyEntrySaveError();
  }, [editEntry?.isSuccess, editEntry?.isError]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Entry</h1>

      <div className="bg-white rounded-xl p-4">
        {/* Loading view */}
        {entryData?.isLoading && (
          <h1 className="text-xl text-center">Loading...</h1>
        )}
        {/* Error view */}
        {entryData?.isError && (
          <div className="text-red-500">
            <h1 className="text-4xl text-center pt-8">😢</h1>
            <h1 className="text-xl text-center pt-4 pb-2">
              There was an error.
            </h1>
            <p className="text-sm text-center pb-8">
              {entryData.isError &&
                entryData?.error?.response?.data?.error?.message}
            </p>
          </div>
        )}

        {/* Entry view */}
        {entryData?.data && !entryData?.isLoading && (
          <>
            <Entry classname="w-full" {...entry} />

            {/* Entry edit view */}
            <div className="mt-4">
              {/* Edit form opening button */}
              {!isEditMode && entryData?.isSuccess && (
                <Button
                  className="h-12 w-auto px-4"
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                >
                  Edit
                </Button>
              )}

              {isEditMode && (
                <Formik
                  initialValues={{ narration: entry.narration }}
                  validationSchema={EntryEditSchema}
                  onSubmit={(values) => {
                    editEntry.mutate(values);
                  }}
                >
                  {({ values }) => (
                    <Form>
                      <Textarea
                        label="Narration"
                        placeholder="New narration"
                        name="narration"
                      />

                      <p className="text-red-500 text-sm text-left">
                        {editEntry?.isError &&
                          editEntry?.error?.response?.data?.error?.message}
                      </p>

                      <span
                        className={`text-sm ${
                          values?.narration?.length > ENTRY_NARRATION_MAX_LENGTH
                            ? "text-red-500"
                            : null
                        }`}
                      >
                        ({values?.narration?.length}/
                        {ENTRY_NARRATION_MAX_LENGTH})
                      </span>

                      <div className="mt-2">
                        <Button
                          type="submit"
                          className="h-12 w-auto px-4"
                          isLoading={editEntry?.isPending}
                        >
                          {editEntry?.isSuccess
                            ? "Saved 🎉"
                            : editEntry?.isPending
                            ? "Saving..."
                            : "Save"}
                        </Button>

                        <Button
                          variant="secondary"
                          className="h-12 w-auto ms-4 px-4"
                          onClick={() => setIsEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
