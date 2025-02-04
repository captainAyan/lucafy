import { INDIAN, INTERNATIONAL } from "../constants/amountFormat";

export default function amountFormat(amount, format, symbol) {
  const a = Math.abs(amount).toString();

  let result = "";

  // comma format
  if (format === INDIAN) {
    let lastThree = a.substring(a.length - 3);
    let otherNumbers = a.substring(0, a.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  } else if (format === INTERNATIONAL) {
    result = a.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // currency symbol
  result = `${symbol} ${result}`;

  return result;
}
