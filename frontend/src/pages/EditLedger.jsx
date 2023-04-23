import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import MiniLoading from "../components/MiniLoading";
import Alert from "../components/Alert";
import {
  useEditLedgerHook,
  useLedgerDataHook,
} from "../hooks/useLedgerDataHook";

export default function EditLedger() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });
  const { name, type, description } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    const data = {
      name,
      type,
      description,
    };

    editLedger(data);
  };

  const {
    mutate: editLedger,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useEditLedgerHook(token, id);

  const {
    isLoading: isFetching,
    error: fetchingError,
    isError: isFetchingError,
    data: fetchedData,
  } = useLedgerDataHook(token, id);

  useEffect(() => {
    setFormData({
      name: fetchedData?.data?.name,
      type: fetchedData?.data?.type,
      description: fetchedData?.data?.description,
    });
  }, [fetchedData]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Edit Ledger</h1>
            </div>

            {isFetchingError && (
              <Alert
                type="error"
                message={fetchingError?.response?.data?.error?.message}
              />
            )}

            <h1 className="text-2xs font-thin break-all uppercase text-justify">
              #{id}
            </h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>

                {isFetching ? <MiniLoading /> : null}
              </label>
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered"
                value={name || ""} // uncontrolled input issue fixed
                onChange={onChange}
                name="name"
                autoFocus
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered"
                value={type}
                onChange={onChange}
                name="type"
              >
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="income">Income</option>
                <option value="expenditure">Expenditure</option>
                <option value="equity">Equity</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Description"
                maxLength={200}
                value={description}
                onChange={onChange}
                name="description"
              ></textarea>
              <label className="label">
                <span className="label-text-alt">
                  ({description?.length || 0}/200)
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
