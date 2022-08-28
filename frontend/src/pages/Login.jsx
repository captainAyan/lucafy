import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="p-4 min-h-screen">
      <center>
        <div className="card w-full max-w-sm bg-base-100 sm:mt-32">
          <div className="card-body sm:w-96 w-full">
            <div className="card-title">
              <h1 className="text-4xl font-bold">Login</h1>
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
                type="text"
                placeholder="Password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-4">
              <button className="btn btn-primary">Login</button>
            </div>

            <div className="form-control mt-2">
              <Link to="/register" className="btn btn-outline btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
