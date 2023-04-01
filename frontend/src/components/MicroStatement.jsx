import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import amountFormat from "../util/amountFormat";
import axios from "axios";
import { GET_MICRO_STATEMENT_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export default function MicroStatement() {
  const { user } = useSelector((state) => state.auth);
  const { amountFormat: currencyFormat, currency } = useSelector(
    (state) => state.preference
  );

  const [statement, setStatement] = useState({});

  const { data } = useQuery(["micro-statement"], () =>
    axios.get(GET_MICRO_STATEMENT_URL, authConfig(user?.token))
  );

  useEffect(() => {
    setStatement(data?.data);
  }, [data]);

  return (
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
  );
}
