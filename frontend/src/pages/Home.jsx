import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";

import statementService from "../features/statement/statementService";
import Alert from "../components/Alert";
import amountFormat from "../util/amountFormat";

const today = new Date();

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  // return newDate;

  var d = newDate,
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default function Home() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { amountFormat: currencyFormat, currency } = useSelector(
    (state) => state.preference
  );

  const [statement, setStatement] = useState({});
  const [heatmap, setHeatmap] = useState([]);
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

  const getHeatmap = async () => {
    try {
      const data = await statementService.getCalendarHeatmap(user?.token);

      const hm_default = [];
      const hm_actual = [];

      for (let index = 0; index <= 150; index++) {
        hm_default.push({
          date: shiftDate(today, -index),
          count: 0,
        });
      }

      for (const entry of data) {
        hm_actual.push({
          count: entry.frequency,
          date: entry.date,
        });
      }

      const map = new Map();
      hm_default.forEach((item) => map.set(item.date, item));
      hm_actual.forEach((item) =>
        map.set(item.date, { ...map.get(item.date), ...item })
      );
      const hm = Array.from(map.values());

      setHeatmap(hm);
    } catch (e) {
      console.log(e);
      setHeatmap([]);
      setError(e.response.data.error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getStatement();
      getHeatmap();
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

          <div className="mt-8 text-sm text-white">
            <CalendarHeatmap
              startDate={shiftDate(today, -150)}
              endDate={today}
              values={heatmap}
              showWeekdayLabels={true}
              classForValue={(value) => {
                if (value?.count === 0) return `color-empty`;
                else if (value?.count > 5) return `color-palette-5`;
                else return `color-palette-${value?.count}`;
              }}
              tooltipDataAttrs={(value) => {
                return {
                  "data-tip": `${value?.count} ${
                    value?.count > 1 ? "entries" : "entry"
                  } on ${value?.date}`,
                };
              }}
            />
            <ReactTooltip />
          </div>
        </div>
      </center>
    </div>
  );
}
