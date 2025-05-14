import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Formik, Form } from "formik";

import { useEditEntryHook, useEntryDataHook } from "../hooks/useEntryDataHook";
import Entry from "../components/Entry";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import { ENTRY_NARRATION_MAX_LENGTH } from "../constants/policies";
import { EntryEditSchema } from "../util/entryValidationSchema";

export default function ViewEntry() {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [entry, setEntry] = useState({});

  const {
    isLoading: isFetching,
    error: fetchingError,
    isSuccess: isFetchingSuccess,
    isError: isFetchingError,
    data: fetchedData,
  } = useEntryDataHook(token, id);

  useEffect(() => {
    if (isFetchingSuccess) setEntry(fetchedData?.data);
  }, [fetchedData, isFetchingSuccess]);

  const [isEditMode, setIsEditMode] = useState(false);
  const {
    mutate: editEntry,
    data: editedData,
    isPending: isSavingEdit,
    isError: isEditError,
    error: editError,
    isSuccess: isEditSuccess,
  } = useEditEntryHook(token, id);

  useEffect(() => {
    if (isEditSuccess) setEntry(editedData?.data);
  }, [editedData, isEditSuccess]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Entry</h1>

      <div className="bg-white rounded-xl pb-4">
        {/* Loading view */}
        {isFetching && <h1 className="text-xl text-center py-8">Loading...</h1>}
        {/* Error view */}
        {isFetchingError && (
          <div className="text-red-500">
            <h1 className="text-4xl text-center pt-8">😢</h1>
            <h1 className="text-xl text-center pt-4 pb-2">
              There was an error.
            </h1>
            <p className="text-sm text-center pb-8">
              {fetchingError?.response?.data?.error?.message}
            </p>
          </div>
        )}

        {/* Entry view */}
        {fetchedData && !isFetching && <Entry classname="w-full" {...entry} />}

        <div className="px-4 pt-2">
          {/* Edit form opening button */}
          {!isEditMode && isFetchingSuccess && (
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
            <div>
              <Formik
                initialValues={{ narration: entry.narration }}
                validationSchema={EntryEditSchema}
                onSubmit={(values) => {
                  editEntry(values);
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
                      {isEditError && editError?.response?.data?.error?.message}
                    </p>

                    <span
                      className={`text-sm ${
                        values?.narration?.length > ENTRY_NARRATION_MAX_LENGTH
                          ? "text-red-500"
                          : null
                      }`}
                    >
                      ({values?.narration?.length}/{ENTRY_NARRATION_MAX_LENGTH})
                    </span>

                    <div className="mt-2">
                      <Button
                        type="submit"
                        className="h-12 w-auto px-4"
                        isLoading={isSavingEdit}
                      >
                        {isEditSuccess
                          ? "Saved 🎉"
                          : isSavingEdit
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
