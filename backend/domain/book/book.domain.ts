import type { CurrencyCode } from "../../constants/currencyCodes.js";

export default interface Book {
  id: string;
  organization: string;
  address: string;
  currencyCode: CurrencyCode;
  createdAt: Date;
  updatedAt: Date;
}
