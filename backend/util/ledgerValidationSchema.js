const Joi = require("joi");
const {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} = require("../constants/ledgerTypes");

const {
  LEDGER_NAME_MAX_LENGTH,
  LEDGER_DESCRIPTION_MAX_LENGTH,
} = require("../constants/policies");

const createSchema = Joi.object({
  name: Joi.string().min(1).max(LEDGER_NAME_MAX_LENGTH).required(),
  type: Joi.string()
    .valid(INCOME, EXPENDITURE, ASSET, LIABILITY, EQUITY)
    .required(),
  description: Joi.string()
    .min(1)
    .max(LEDGER_DESCRIPTION_MAX_LENGTH)
    .required(),
});

const editSchema = Joi.object({
  name: Joi.string().min(1).max(LEDGER_NAME_MAX_LENGTH).required(),
  type: Joi.string()
    .valid(INCOME, EXPENDITURE, ASSET, LIABILITY, EQUITY)
    .required(),
  description: Joi.string()
    .min(1)
    .max(LEDGER_DESCRIPTION_MAX_LENGTH)
    .required(),
});

module.exports = { createSchema, editSchema };
