import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";
import useActivityHeatMapData from "../hooks/useActivityHeatMapData";

const today = new Date();

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);

  var d = newDate,
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default function ActivityHeatMap() {
  const { token } = useSelector((state) => state.auth);

  const [heatmap, setHeatmap] = useState([]);
  const { data } = useActivityHeatMapData(token);

  useEffect(() => {
    if (data) {
      const hm_default = [];
      const hm_actual = [];

      for (let index = 0; index <= 154; index++) {
        hm_default.push({
          date: shiftDate(today, -index),
          count: 0,
        });
      }

      for (const entry of data?.data) {
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
    }
  }, [data]);

  return (
    <>
      <h1 className="text-xl font-bold text-left mt-6">Activity</h1>
      <div className="mt-4 text-sm">
        <CalendarHeatmap
          startDate={shiftDate(today, -154)}
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
    </>
  );
}
