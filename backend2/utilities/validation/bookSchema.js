const Joi = require("joi");

const {
  ORGANIZATION_NAME_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
  CURRENCY_CODE_ENUM,
} = require("../../constants/policies");

const createSchema = Joi.object({
  organization: Joi.string()
    .min(1)
    .max(ORGANIZATION_NAME_MAX_LENGTH)
    .required(),
  address: Joi.string().min(1).max(ADDRESS_MAX_LENGTH).required(),
  currencyCode: Joi.string()
    .valid(...CURRENCY_CODE_ENUM)
    .required(),
}).options({ stripUnknown: true });

const editSchema = Joi.object({
  organization: Joi.string()
    .min(1)
    .max(ORGANIZATION_NAME_MAX_LENGTH)
    .required(),
  address: Joi.string().min(1).max(ADDRESS_MAX_LENGTH).required(),
  currencyCode: Joi.string()
    .valid(...CURRENCY_CODE_ENUM)
    .required(),
}).options({ stripUnknown: true });

module.exports = {
  createSchema,
  editSchema,
};
