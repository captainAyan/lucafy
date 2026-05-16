import { z } from "zod";

import {
  ORGANIZATION_NAME_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
} from "../../constants/policies.js";
import { CurrencyCode as CurrencyCodeEnum } from "../../constants/currencyCodes.js";

const baseSchema = {
  organization: z.string().min(1).max(ORGANIZATION_NAME_MAX_LENGTH),
  address: z.string().min(1).max(ADDRESS_MAX_LENGTH),
  currencyCode: z.enum(CurrencyCodeEnum),
};

export const createBookSchema = z.object(baseSchema).strip();

export const editBookSchema = z.object(baseSchema).strip();
