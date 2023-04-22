import React, { useState } from "react";

import {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} from "../constants/ledgerTypes";
import { useAddLedgerHook } from "../hooks/useLedgerDataHook";
import { useSelector } from "react-redux";

export default function CreateLedger() {
  const { token } = useSelector((state) => state.auth2);

  const [formData, setFormData] = useState({
    name: "",
    type: ASSET,
    description: "",
  });
  const { name, type, description } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const data = {
      name,
      type,
      description,
    };

    addLedger(data);
  };

  const {
    mutate: addLedger,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useAddLedgerHook(token);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Create Ledger</h1>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                onChange={onChange}
                value={name}
                placeholder="Name"
                className="input input-bordered"
                autoFocus
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select
                className="select select-bordered"
                name="type"
                onChange={onChange}
                value={type}
              >
                <option value={ASSET}>Asset</option>
                <option value={LIABILITY}>Liability</option>
                <option value={INCOME}>Income</option>
                <option value={EXPENDITURE}>Expenditure</option>
                <option value={EQUITY}>Equity</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Description"
                value={description}
                maxLength={200}
                name="description"
                onChange={onChange}
              ></textarea>
              <label className="label">
                <span className="label-text-alt">
                  ({description.length}/200)
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
