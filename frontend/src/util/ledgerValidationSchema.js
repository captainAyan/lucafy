import * as Yup from "yup";
import {
  LEDGER_NAME_MAX_LENGTH,
  LEDGER_DESCRIPTION_MAX_LENGTH,
} from "../constants/policies";
import {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} from "../constants/ledgerTypes";

export default Yup.object().shape({
  name: Yup.string()
    .label("Name")
    .min(1)
    .max(LEDGER_NAME_MAX_LENGTH)
    .required(),
  type: Yup.string()
    .label("Type")
    .oneOf([INCOME, EXPENDITURE, ASSET, LIABILITY, EQUITY])
    .required(),
  description: Yup.string()
    .label("Description")
    .min(1)
    .max(LEDGER_DESCRIPTION_MAX_LENGTH)
    .required(),
});
