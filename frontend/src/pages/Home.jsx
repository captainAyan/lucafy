import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="p-4 min-h-screen ">
      <center>
        <div className="w-full max-w-sm sm:mt-4">
          <h1 className="text-4xl font-bold text-left mb-8">Home</h1>
        </div>
      </center>
    </div>
  );
}
