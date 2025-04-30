import { useSelector } from "react-redux";

import { amountFormatLong } from "../util/amountFormat";

export default function Amount({ amount }) {
  const { amountFormat, currency } = useSelector((state) => state.preference);
  const formattedAmount = amountFormatLong(amount, amountFormat, currency);

  return <>{formattedAmount}</>;
}
