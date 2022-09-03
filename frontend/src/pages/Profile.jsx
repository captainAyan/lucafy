import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Profile() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="card w-full max-w-sm bg-base-100 sm:mt-36">
      <figure>
        <img
          src={`https://pixel-profile-pic.herokuapp.com/api?width=20&cell=5&color=4da3ff&seed=${user?.id}`}
          alt="Profile"
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
  );
}
