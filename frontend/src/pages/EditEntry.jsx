import { useParams } from "react-router-dom";

export default function EditEntry() {
  const { id } = useParams();

  return (
    <div className="card w-full max-w-sm bg-base-100 sm:mt-32">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-4xl font-bold">Edit Entry</h1>
        </div>
        <h1 className="text-2xs font-thin break-all capitalize text-justify">
          #{id}
        </h1>

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
          <button className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}
