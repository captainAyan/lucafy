import timeFormat from "../util/timeFormat";

export default function Time({ time }) {
  const _time = timeFormat(time);
  return <>{_time}</>;
}
