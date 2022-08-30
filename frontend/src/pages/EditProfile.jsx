export default function EditProfile() {
  return (
    <div className="card w-full max-w-sm bg-base-100 sm:mt-36">
      <div className="card-body sm:w-96 w-full">
        <div className="card-title">
          <h1 className="text-4xl font-bold">Edit Profile</h1>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered"
            value="John"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered"
            value="Doe"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            value="johndoe@gmail.com"
          />
        </div>

        <div className="form-control mt-4">
          <button className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}
