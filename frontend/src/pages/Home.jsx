import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  });

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-4">Home</h1>
          <h1 className="text-2xl font-thin text-left">
            Welcome back,{" "}
            <span className="font-bold capitalize">
              {user && user.firstName}
            </span>
          </h1>
          <div className="stats mt-4 w-full">
            <div className="stat">
              <div className="stat-title">Assets</div>
              <div className="stat-value">₹ 9,400</div>
              <div className="stat-desc">Total Assets</div>
            </div>

            <div className="stat">
              <div className="stat-title">Net Income</div>
              <div className="stat-value">₹ 1,500</div>
              <div className="stat-desc">Income less Expenditures</div>
            </div>
          </div>

          <Link to="/entry">
            <button className="btn btn-accent w-full mt-4">Create Entry</button>
          </Link>
        </div>
      </center>
    </div>
  );
}
