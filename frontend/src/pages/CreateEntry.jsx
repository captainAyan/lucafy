import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useAddEntryHook } from "../hooks/useEntryDataHook";
import Loading from "../components/Loading";
import { useAllLedgerDataHook } from "../hooks/useLedgerDataHook";
import Alert from "../components/Alert";

export default function CreateEntry() {
  const { token } = useSelector((state) => state.auth2);

  const [formData, setFormData] = useState({
    debit_ledger_id: "",
    credit_ledger_id: "",
    amount: 0,
    narration: "",
  });
  const { debit_ledger_id, credit_ledger_id, amount, narration } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const data = {
      debit_ledger_id,
      credit_ledger_id,
      amount,
      narration,
    };
    addEntry(data);
  };

  const {
    mutate: addEntry,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useAddEntryHook(token);

  const {
    isLoading: isFetching,
    error: fetchingError,
    isError: isFetchingError,
    isSuccess: isFetchingSuccessful,
    data: fetchedData,
  } = useAllLedgerDataHook(token);

  useEffect(() => {
    if (isFetchingSuccessful) {
      setFormData({
        ...formData,
        debit_ledger_id: fetchedData?.data?.ledgers[0]?.id, // default
        credit_ledger_id: fetchedData?.data?.ledgers[0]?.id, // default
      });
    }
  }, [fetchedData, isFetchingSuccessful]);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Create Entry</h1>
            </div>

            {isFetchingError && (
              <Alert
                type="error"
                message={fetchingError?.response?.data?.error?.message}
              />
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Debit</span>
                {isFetching ? <Loading /> : null}
              </label>
              <select
                className="select select-bordered capitalize"
                name="debit_ledger_id"
                onChange={onChange}
                value={debit_ledger_id}
                autoFocus
              >
                {fetchedData?.data?.ledgers?.map((item) => {
                  return (
                    <option value={item.id} key={item.id}>
                      {item.name} A/c
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Credit</span>
              </label>
              <select
                className="select select-bordered capitalize"
                name="credit_ledger_id"
                onChange={onChange}
                value={credit_ledger_id}
              >
                {fetchedData?.data?.ledgers?.map((item) => {
                  return (
                    <option value={item.id} key={item.id}>
                      {item.name} A/c
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                placeholder="Amount"
                className="input input-bordered"
                value={amount}
                name="amount"
                onChange={onChange}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Narration</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Narration"
                value={narration}
                maxLength={200}
                name="narration"
                onChange={onChange}
              ></textarea>
              <label className="label">
                <span className="label-text-alt">({narration.length}/200)</span>
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
