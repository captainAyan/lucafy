const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { ENTRY_NARRATION_MAX_LENGTH } = require("../constants/policies");

const createSchema = Joi.object({
  debit_ledger_id: Joi.objectId().required(),
  credit_ledger_id: Joi.objectId().required(),
  amount: Joi.number().greater(0).integer().required(),
  narration: Joi.string().min(1).max(ENTRY_NARRATION_MAX_LENGTH).required(),
});

const editSchema = Joi.object({
  narration: Joi.string().min(1).max(ENTRY_NARRATION_MAX_LENGTH).required(),
});

module.exports = { createSchema, editSchema };
