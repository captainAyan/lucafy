import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";

import statementService from "../features/statement/statementService";
import Alert from "../components/Alert";
import MicroStatement from "../components/MicroStatement";

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

  const [heatmap, setHeatmap] = useState([]);
  const [error, setError] = useState();

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

          <MicroStatement />

          <Link to="/entry">
            <button className="btn btn-accent w-full mt-4">Create Entry</button>
          </Link>

          <h1 className="text-xl font-bold text-left mt-6">Activity</h1>
          <div className="mt-4 text-sm">
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
