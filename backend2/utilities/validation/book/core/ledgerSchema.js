const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const {
  LEDGER_NAME_MAX_LENGTH,
  LEDGER_DESCRIPTION_MAX_LENGTH,
} = require("../../../../constants/policies");

const baseSchema = Joi.object({
  name: Joi.string().min(1).max(LEDGER_NAME_MAX_LENGTH).required(),
  description: Joi.string()
    .min(1)
    .max(LEDGER_DESCRIPTION_MAX_LENGTH)
    .required(),
  ledgerGroupId: Joi.objectId().required(),
}).options({ stripUnknown: true });

const createSchema = baseSchema;
const editSchema = baseSchema;

module.exports = { createSchema, editSchema };
