const Joi = require("joi");

const {
  LEDGER_NAME_MAX_LENGTH,
  LEDGER_DESCRIPTION_MAX_LENGTH,
} = require("../../constants/policies");

const createSchema = Joi.object({
  name: Joi.string().min(1).max(LEDGER_NAME_MAX_LENGTH).required(),
  description: Joi.string()
    .min(1)
    .max(LEDGER_DESCRIPTION_MAX_LENGTH)
    .required(),
}).options({ stripUnknown: true });

const editSchema = Joi.object({
  name: Joi.string().min(1).max(LEDGER_NAME_MAX_LENGTH).required(),
  description: Joi.string()
    .min(1)
    .max(LEDGER_DESCRIPTION_MAX_LENGTH)
    .required(),
}).options({ stripUnknown: true });

module.exports = { createSchema, editSchema };
