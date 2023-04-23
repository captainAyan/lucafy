import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import MiniLoading from "../components/MiniLoading";
import { useEditEntryHook, useEntryDataHook } from "../hooks/useEntryDataHook";
import Alert from "../components/Alert";

export default function EditEntry() {
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    narration: "",
  });
  const { narration } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    const data = { narration };
    editEntry(data);
  };

  const {
    mutate: editEntry,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useEditEntryHook(token, id);

  const {
    isLoading: isFetching,
    error: fetchingError,
    isError: isFetchingError,
    data: fetchedData,
  } = useEntryDataHook(token, id);

  useEffect(() => {
    setFormData({ narration: fetchedData?.data?.narration });
  }, [fetchedData]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Edit Entry</h1>
            </div>

            {isFetchingError && (
              <Alert
                type="error"
                message={fetchingError?.response?.data?.error?.message}
              />
            )}

            <h1 className="text-2xs font-thin break-all text-justify uppercase">
              #{id}
            </h1>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Narration</span>

                {isFetching ? <MiniLoading /> : null}
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Narration"
                maxLength={200}
                onChange={onChange}
                value={narration}
                name="narration"
                autoFocus
              ></textarea>
              <label className="label">
                <span className="label-text-alt">
                  ({narration?.length || 0}/200)
                </span>
              </label>
            </div>

            <p className="text-red-500 text-sm text-left">
              {isError && error?.response?.data?.error?.message}
            </p>

            <div className="form-control mt-2">
              <button
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                onClick={handleSubmit}
              >
                {isSuccess ? "Saved 🎉" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
