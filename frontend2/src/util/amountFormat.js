import { INDIAN, INTERNATIONAL } from "../constants/amountFormat";

export function amountFormatLong(amount, format, currencySymbol) {
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
  result = `${currencySymbol}${result}`;

  return result;
}

export function amountFormatShort(amount, format, currencySymbol) {
  const a = Math.abs(amount).toString();

  let result = "";

  if (format === INDIAN) {
    if (a >= 1_00_00_000) {
      result = (a / 1_00_00_000).toFixed(1) + "Cr";
    } else if (a >= 1_00_000) {
      result = (a / 1_00_000).toFixed(1) + "L";
    } else if (a >= 1_000) {
      result = (a / 1_000).toFixed(1) + "K";
    } else {
      result = a;
    }
  } else if (format === INTERNATIONAL) {
    if (a >= 1_000_000_000) {
      result = (a / 1_000_000_000).toFixed(1) + "B";
    } else if (a >= 1_000_000) {
      result = (a / 1_000_000).toFixed(1) + "M";
    } else if (a >= 1_000) {
      result = (a / 1_000).toFixed(1) + "K";
    } else {
      result = a;
    }
  }

  result = `${currencySymbol}${result}`;

  return result;
}
