export default function timeFormat(date) {
  const dateObj = new Date(date);
  const dateString = [
    dateObj.getDate().toString().padStart(2, "0"),
    (dateObj.getMonth() + 1).toString().padStart(2, "0"),
    dateObj.getFullYear(),
  ].join("/");

  const timeString = [
    dateObj.getHours().toString().padStart(2, "0"),
    dateObj.getMinutes().toString().padStart(2, "0"),
  ].join(":");

  return `${dateString} - ${timeString}`;
}
