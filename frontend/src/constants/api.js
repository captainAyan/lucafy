export const DOMAIN =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "";

export const VERSION = "v1";
export const BASE_URL = `${DOMAIN}/api/${VERSION}`;

export const BASE_AUTH_URL = `${BASE_URL}/auth`;
export const REGISTER_URL = `${BASE_AUTH_URL}/register`;
export const LOGIN_URL = `${BASE_AUTH_URL}/login`;

export const BASE_PROFILE_URL = `${BASE_URL}/profile`;
export const GET_PROFILE_URL = `${BASE_PROFILE_URL}/`;
export const EDIT_PROFILE_URL = `${BASE_PROFILE_URL}/`;
export const DELETE_PROFILE_URL = `${BASE_PROFILE_URL}/`;

export const BASE_LEDGER_URL = `${BASE_URL}/ledger`;
export const CREATE_LEDGER_URL = `${BASE_LEDGER_URL}/`;
export const GET_LEDGER_URL = `${BASE_LEDGER_URL}/`;
export const GET_ALL_LEDGER_URL = `${BASE_LEDGER_URL}/all`;
export const EDIT_LEDGER_URL = `${BASE_LEDGER_URL}/`;

export const BASE_ENTRY_URL = `${BASE_URL}/entry`;
export const CREATE_ENTRY_URL = `${BASE_ENTRY_URL}/`;
export const GET_ENTRY_URL = `${BASE_ENTRY_URL}/`;
export const EDIT_ENTRY_URL = `${BASE_ENTRY_URL}/`;

export const BASE_STATEMENT_URL = `${BASE_URL}/statement`;
export const GET_LEDGER_STATEMENT_URL = `${BASE_STATEMENT_URL}/ledger/`;
export const GET_TRIAL_BALANCE_URL = `${BASE_STATEMENT_URL}/trial-balance`;
