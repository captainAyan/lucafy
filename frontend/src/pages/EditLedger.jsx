import { useParams } from "react-router-dom";

export default function EditLedger() {
  const { id } = useParams();

  return (
    <div className="card w-full max-w-sm bg-base-100 sm:mt-32">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-4xl font-bold">Edit Ledger</h1>
        </div>
        <h1 className="text-2xs font-thin break-all capitalize text-justify">
          #{id}
        </h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered"
            value="Salary"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Type</span>
          </label>
          <select className="select select-bordered" value="income">
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
            value="Description of the ledger"
          ></textarea>
          <label className="label">
            <span className="label-text-alt">(25/200)</span>
          </label>
        </div>

        <div className="form-control mt-4">
          <button className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}
