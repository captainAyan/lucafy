export default function CreateLedger() {
  return (
    <div className="p-4 min-h-screen">
      <center>
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
                placeholder="Name"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type</span>
              </label>
              <select className="select select-bordered">
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
              ></textarea>
              <label className="label">
                <span className="label-text-alt">(0/200)</span>
              </label>
            </div>

            <div className="form-control mt-4">
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
