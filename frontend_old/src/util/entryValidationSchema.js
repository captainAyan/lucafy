import * as Yup from "yup";
import { ENTRY_NARRATION_MAX_LENGTH } from "../constants/policies";

export const EntryCreateSchema = Yup.object().shape({
  debit_ledger_id: Yup.string().label("Debit Ledger Id").required(),
  credit_ledger_id: Yup.string().label("Credit Ledger Id").required(),
  amount: Yup.number().label("Amount").integer().positive().min(1).required(),
  narration: Yup.string()
    .label("Narration")
    .min(1)
    .max(ENTRY_NARRATION_MAX_LENGTH)
    .required(),
});

export const EntryEditSchema = Yup.object().shape({
  narration: Yup.string()
    .label("Narration")
    .min(1)
    .max(ENTRY_NARRATION_MAX_LENGTH)
    .required(),
});
