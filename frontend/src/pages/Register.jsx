import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="p-4 min-h-screen">
      <center>
        <div className="card w-full max-w-sm bg-base-100 sm:mt-16">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Register</h1>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered"
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
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered mt-2"
              />
            </div>
            <div className="form-control mt-4">
              <button className="btn btn-primary">Register</button>
            </div>

            <div className="form-control mt-2">
              <Link to="/login" className="btn btn-outline btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
