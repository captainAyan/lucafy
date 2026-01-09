import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../components/Avatar";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-4 bg-base-200">
      <center>
        <div className="card w-full max-w-sm bg-base-100">
          <figure>
            <Avatar
              width={20}
              cell={5}
              color={"#4da3ff"}
              seed={user?.id}
              className="mt-8 border-4 rounded-full"
            />
          </figure>
          <div className="card-body sm:w-96 w-full items-center text-center pb-8">
            <div className="card-title">
              <h1 className="text-4xl font-thin break-all capitalize">
                {user?.firstName}
              </h1>
            </div>
            <h2 className="text-xl font-bold break-all capitalize">
              {user?.lastName}
            </h2>
            <h4 className="text-sm break-all">{user?.email}</h4>
            <div className="form-control w-full mt-4">
              <Link to="edit" className="btn btn-primary">
                Edit
              </Link>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}
