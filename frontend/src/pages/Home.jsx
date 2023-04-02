import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import MicroStatement from "../components/MicroStatement";
import ActivityHeatMap from "../components/ActivityHeatMap";

export default function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-4 bg-base-200 mb-auto">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-4">Home</h1>
          <h1 className="text-2xl font-thin text-left">
            Welcome back,{" "}
            <span className="font-bold capitalize">{user?.firstName}</span>
          </h1>

          <MicroStatement />

          <Link to="/entry">
            <button className="btn btn-accent w-full mt-4">Create Entry</button>
          </Link>

          <ActivityHeatMap />
        </div>
      </center>
    </div>
  );
}
