import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="mx-auto mt-2 max-w-6xl">
      <h1 className="text-4xl font-bold">Landing Page</h1>
      <p>This is the landing page</p>
      <p>
        <Link to="/login" className="text-red-500">
          Login
        </Link>
      </p>
    </div>
  );
}
