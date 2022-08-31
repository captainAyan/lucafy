import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { create, reset } from "../features/ledger/ledgerSlice";
import {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} from "../constants/ledgerTypes";

export default function CreateLedger() {
  const [formData, setFormData] = useState({
    name: "",
    type: ASSET,
    description: "",
  });
  const { name, type, description } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.ledger
  );
  const { user } = useSelector((state) => state.auth);

  const [helperText, setHelperText] = useState("");
  const [saveButtonLabel, setSaveButtonLabel] = useState("Save");

  useEffect(() => {
    if (isError) {
      setHelperText(message);
    }

    if (isSuccess) {
      setSaveButtonLabel("Saved 🎉");
      setHelperText("");
    }

    if (!user) {
      navigate("/login");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

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

    dispatch(create(data));
  };

  return (
    <div className="card w-full max-w-sm bg-base-100 sm:mt-32">
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
            <span className="label-text-alt">({description.length}/200)</span>
          </label>
        </div>

        <p className="text-red-500 text-sm text-left">{helperText}</p>

        <div className="form-control mt-2">
          <button
            className={`btn btn-primary ${isLoading ? "loading" : ""}`}
            onClick={handleSubmit}
          >
            {saveButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
