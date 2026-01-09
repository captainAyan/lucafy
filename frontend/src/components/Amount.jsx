import { useSelector } from "react-redux";

import { amountFormatLong, amountFormatShort } from "../util/amountFormat";

export default function Amount({
  amount,
  isCreditBalance = false,
  shortFormat = false,
}) {
  const correctedAmount = isCreditBalance ? amount * -1 : amount;
  const { amountFormat, currency } = useSelector((state) => state.preference);
  const formattedAmount = shortFormat
    ? amountFormatShort(correctedAmount, amountFormat, currency)
    : amountFormatLong(correctedAmount, amountFormat, currency);

  return <>{formattedAmount}</>;
}
