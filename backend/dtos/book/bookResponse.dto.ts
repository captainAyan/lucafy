import type { CurrencyCode } from "../../constants/currencyCodes.js";

export default interface BookResponseDto {
  id: string;
  organization: string;
  address: string;
  currencyCode: CurrencyCode;
  createdAt?: string;
  updatedAt?: string;
}
