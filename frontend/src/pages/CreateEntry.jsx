export default function CreateEntry() {
  return (
    <div className="card w-full max-w-sm bg-base-100 sm:mt-24">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-4xl font-bold">Create Entry</h1>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Debit</span>
          </label>
          <select className="select select-bordered">
            <option value="1">Cash A/c</option>
            <option value="2">Salary A/c</option>
            <option value="3">Expenses A/c</option>
            <option value="4">Pocket Money A/c</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Credit</span>
          </label>
          <select className="select select-bordered">
            <option value="1">Cash A/c</option>
            <option value="2">Salary A/c</option>
            <option value="3">Expenses A/c</option>
            <option value="4">Pocket Money A/c</option>
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
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Narration</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Narration"
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
  );
}
