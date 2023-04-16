import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import entryService from "../features/entry/entryService";

export default function CreateEntry() {
  const { ledgers, gotAll } = useSelector((state) => state.ledger);
  const { user, token } = useSelector((state) => state.auth2);

  const [formData, setFormData] = useState({
    debit_ledger_id: ledgers.length > 0 ? ledgers[0].id : "",
    credit_ledger_id: ledgers.length > 0 ? ledgers[0].id : "",
    amount: 0,
    narration: "",
  });
  const { debit_ledger_id, credit_ledger_id, amount, narration } = formData;

  const [isLoading, setIsLoading] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [saveButtonLabel, setSaveButtonLabel] = useState("Save");

  useEffect(() => {
    if (gotAll) {
      /**
       * In case the user directly opens up this page and the ledgers are not
       * saved in the redux store yet
       */
      setFormData((prevState) => ({
        ...prevState,
        debit_ledger_id: ledgers.length > 0 ? ledgers[0].id : "",
        credit_ledger_id: ledgers.length > 0 ? ledgers[0].id : "",
      }));
    }
  }, [user, gotAll, ledgers]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      debit_ledger_id,
      credit_ledger_id,
      amount,
      narration,
    };

    try {
      await entryService.create(data, token);

      setSaveButtonLabel("Saved 🎉");
      setHelperText("");
    } catch (e) {
      setSaveButtonLabel("Save");
      setHelperText(e.response.data.error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Create Entry</h1>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Debit</span>
              </label>
              <select
                className="select select-bordered capitalize"
                name="debit_ledger_id"
                onChange={onChange}
                value={debit_ledger_id}
                autoFocus
              >
                {ledgers.map((item) => {
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
                {ledgers.map((item) => {
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
      </center>
    </div>
  );
}
