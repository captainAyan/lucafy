exports.LEDGER_LIMIT = 20;
exports.ENTRY_LIMIT = 100;

exports.PER_MINUTE_REQUEST_LIMIT = 100;
exports.DEFAULT_PAGINATION_LIMIT = 10;

exports.ORGANIZATION_NAME_MAX_LENGTH = 100;
exports.ADDRESS_MAX_LENGTH = 200;

exports.BOOK_MEMBER_ROLE = Object.freeze({
  ADMIN: "admin",
  MEMBER: "member",
});

exports.CURRENCY_CODE_ENUM = require("./currencyCodes");

exports.EMAIL_MAX_LENGTH = 100;
exports.PASSWORD_MIN_LENGTH = 6;
exports.PASSWORD_MAX_LENGTH = 200;

exports.USER_FIRST_NAME_MAX_LENGTH = 100;
exports.USER_MIDDLE_NAME_MAX_LENGTH = 100;
exports.USER_LAST_NAME_MAX_LENGTH = 100;
exports.USER_BIO_MAX_LENGTH = 200;
exports.USER_JOB_TITLE_MAX_LENGTH = 100;
exports.USER_GENDER = Object.freeze({
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  UNSPECIFIED: "",
});

exports.LEDGER_NAME_MAX_LENGTH = 50;
exports.LEDGER_DESCRIPTION_MAX_LENGTH = 200;

exports.ENTRY_NARRATION_MAX_LENGTH = 200;

exports.LEDGER_NATURE = Object.freeze({
  INCOME: "income",
  EXPENDITURE: "expenditure",
  ASSET: "asset",
  LIABILITY: "liability",
  EQUITY: "equity",
});

exports.LEDGER_GROUP_NAME_MAX_LENGTH = 50;
exports.LEDGER_GROUP_DESCRIPTION_MAX_LENGTH = 200;
exports.LEDGER_GROUP_HIERARCHY_MAX_DEPTH = 3;
