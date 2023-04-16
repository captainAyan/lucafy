import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function SelectLedger() {
  const { ledgers, gotAll } = useSelector((state) => state.ledger);

  const [selectedLedgerId, setSelectedLedgerId] = useState("");

  useEffect(() => {
    if (gotAll) {
      setSelectedLedgerId(ledgers.length > 0 ? ledgers[0].id : "");
    }
  }, [gotAll]);

  const onChange = (e) => {
    setSelectedLedgerId(e.target.value);
  };

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Select Ledger</h1>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ledger</span>
              </label>
              <select
                className="select select-bordered capitalize"
                name="debit_ledger_id"
                onChange={onChange}
                value={selectedLedgerId}
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

            <div className="form-control mt-2">
              <Link
                to={`/ledger/${selectedLedgerId}`}
                className="btn btn-primary"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
