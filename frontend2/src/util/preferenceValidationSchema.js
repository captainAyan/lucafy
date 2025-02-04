import * as Yup from "yup";
import {
  RUPEE,
  DOLLAR,
  EURO,
  NAIRA,
  NEW_SHEKEL,
  POUND,
  RUBLE,
  TAKA,
  WON,
  YEN,
} from "../constants/currency";
import { INDIAN, INTERNATIONAL } from "../constants/amountFormat";

export default Yup.object().shape({
  amountFormat: Yup.string()
    .label("Amount Format")
    .oneOf([INDIAN, INTERNATIONAL])
    .required(),
  currency: Yup.string()
    .label("Currency")
    .oneOf([
      RUPEE,
      DOLLAR,
      EURO,
      NAIRA,
      NEW_SHEKEL,
      POUND,
      RUBLE,
      TAKA,
      WON,
      YEN,
    ])
    .required(),
});
