import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import amountFormat from "../util/amountFormat";
import useMicroStatementData from "../hooks/useMicroStatementData";

export default function MicroStatement() {
  const { token } = useSelector((state) => state.auth);
  const { amountFormat: currencyFormat, currency } = useSelector(
    (state) => state.preference
  );

  const [statement, setStatement] = useState({});
  const { data } = useMicroStatementData(token);

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
