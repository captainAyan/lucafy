export const LEDGER_LIMIT = 20;
export const ENTRY_LIMIT = 100;

export const PER_MINUTE_REQUEST_LIMIT = 100;
export const DEFAULT_PAGINATION_LIMIT = 10;

export enum SortOrder {
  NEWEST_FIRST = "newest",
  OLDEST_FIRST = "oldest",
}

export const ORGANIZATION_NAME_MAX_LENGTH = 100;
export const ADDRESS_MAX_LENGTH = 200;

export const BOOK_MEMBER_ROLE = Object.freeze({
  // TODO rename to BookMemberRole
  ADMIN: "admin",
  MEMBER: "member",
});

import currencyCode from "./currencyCodes.js";
export const CURRENCY_CODE_ENUM = currencyCode;

export const EMAIL_MAX_LENGTH = 100;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 200;

export const USER_FIRST_NAME_MAX_LENGTH = 100;
export const USER_MIDDLE_NAME_MAX_LENGTH = 100;
export const USER_LAST_NAME_MAX_LENGTH = 100;
export const USER_BIO_MAX_LENGTH = 200;
export const USER_JOB_TITLE_MAX_LENGTH = 100;

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  UNSPECIFIED = "",
}

export const LEDGER_NAME_MAX_LENGTH = 50;
export const LEDGER_DESCRIPTION_MAX_LENGTH = 200;

export const ENTRY_NARRATION_MAX_LENGTH = 200;

export const LEDGER_NATURE = Object.freeze({
  // TODO LedgerNature
  INCOME: "income",
  EXPENDITURE: "expenditure",
  ASSET: "asset",
  LIABILITY: "liability",
  EQUITY: "equity",
});
export const LEDGER_SIDES = Object.freeze({
  // TODO LedgerSides
  DEBIT: "debit",
  CREDIT: "credit",
});

export const LEDGER_GROUP_NAME_MAX_LENGTH = 50;
export const LEDGER_GROUP_DESCRIPTION_MAX_LENGTH = 200;
export const LEDGER_GROUP_HIERARCHY_MAX_DEPTH = 3;
