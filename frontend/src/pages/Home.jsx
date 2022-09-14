import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import statementService from "../features/statement/statementService";
import Alert from "../components/Alert";
import amountFormat from "../util/amountFormat";

export default function Home() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { amountFormat: currencyFormat, currency } = useSelector(
    (state) => state.preference
  );

  const [statement, setStatement] = useState({});
  const [error, setError] = useState();

  const getStatement = async () => {
    try {
      const s = await statementService.getMicroStatement(user?.token);
      setStatement(s);
    } catch (e) {
      setStatement({});
      setError(e.response.data.error.message);
    }
  };

  useEffect(() => {
    getStatement();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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

          {error ? <Alert type="error" message={error} /> : null}

          <div className="stats mt-4 w-full">
            <div className="stat">
              <div className="stat-title">Assets</div>
              <div className="stat-value font-thin">
                {amountFormat(statement?.asset || 0, currencyFormat, currency)}
              </div>
              <div className="stat-desc mt-2">Total Assets</div>
            </div>

            <div className="stat">
              <div className="stat-title">Net Income</div>
              <div
                className={`stat-value font-thin ${
                  statement?.income - statement?.expenditure < 0
                    ? "text-red-500"
                    : null
                }`}
              >
                {amountFormat(
                  statement?.income - statement?.expenditure || 0,
                  currencyFormat,
                  currency
                )}
              </div>
              <div className="stat-desc mt-2">Income less Expenditures</div>
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
