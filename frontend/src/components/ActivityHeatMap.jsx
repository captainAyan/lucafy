import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";
import useActivityHeatMapData from "../hooks/useActivityHeatMapData";

// Testing with mockdate
// import MockDate from "mockdate";
// MockDate.set("2025-05-19T12:00:00");

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

function createFrequencyTable(timestamps) {
  const frequencyMap = {};

  timestamps.forEach((timestamp) => {
    // Extract the date part from the timestamp (e.g., 'YYYY-MM-DD')
    const date = new Date(timestamp);

    // the following works, but doesn't change the timezone to the local one
    // const date = new Date(timestamp).toISOString().split('T')[0];
    // the following code keeps the locale correct
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    // Update the frequency count for that date
    frequencyMap[dateString] = (frequencyMap[dateString] || 0) + 1;
  });

  // Convert the frequency map to an array of objects
  const frequencyTable = Object.entries(frequencyMap).map(
    ([date, frequency]) => ({
      date,
      frequency,
    })
  );

  return frequencyTable;
}

export default function ActivityHeatMap() {
  const { token } = useSelector((state) => state.auth);

  const [heatmap, setHeatmap] = useState([]);
  const { data } = useActivityHeatMapData(token);

  const today = new Date();
  const endDate = shiftDate(today, 6 - new Date().getDay());
  const startDate = shiftDate(endDate, -24 * 7);

  useEffect(() => {
    if (data) {
      const frequencyMap = new Map();

      // Add default values (0 frequency) for the past 155 days
      for (let index = 0; index <= 7 * 24; index++) {
        const date = shiftDate(endDate, -index);
        frequencyMap.set(date, 0); // Set frequency as 0 for each date
      }

      const hm_actual = createFrequencyTable(data?.data?.timestamps);

      // Merge actual frequency data into the map
      hm_actual.forEach((item) => {
        frequencyMap.set(
          item.date,
          (frequencyMap.get(item.date) || 0) + item.frequency
        );
      });

      const heatmapArray = Array.from(frequencyMap, ([date, frequency]) => ({
        date,
        frequency,
      }));

      setHeatmap(heatmapArray);
    }
  }, [data]);

  return (
    <>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmap}
        showWeekdayLabels={true}
        showMonthLabels={true}
        classForValue={(value) => {
          if (value?.frequency === 0) return `color-empty`;
          else if (value?.frequency > 4) return `color-palette-5`;
          else return `color-palette-${value?.frequency}`;
        }}
        tooltipDataAttrs={(value) => {
          return {
            "data-tip": `${value?.frequency} ${
              value?.frequency > 1 || value?.frequency === 0
                ? "entries"
                : "entry"
            } on ${value?.date}`,
          };
        }}
      />
      <ReactTooltip />
    </>
  );
}
