const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { DEFAULT_PAGINATION_LIMIT } = require("../../constants/policies");

const baseSchema = {
  page: Joi.number().integer().min(0).default(0),
  limit: Joi.number()
    .integer()
    .valid(DEFAULT_PAGINATION_LIMIT, 20, 50)
    .default(DEFAULT_PAGINATION_LIMIT),
  order: Joi.string().valid("oldest", "newest").default("newest"),
};

const schemaOptions = { stripUnknown: true, convert: true };

const paginationQueryParamSchema = Joi.object({
  ...baseSchema,
}).options(schemaOptions);

const paginationQueryParamSchemaWithKeyword = Joi.object({
  ...baseSchema,
  keyword: Joi.string().allow("", null),
}).options(schemaOptions);

const paginationQueryParamSchemaWithKeywordAndLedgerGroupId = Joi.object({
  ...baseSchema,
  keyword: Joi.string().allow("", null),
  ledgerGroupId: Joi.objectId().allow("").default(""),
}).optional(schemaOptions);

module.exports = {
  paginationQueryParamSchema,
  paginationQueryParamSchemaWithKeyword,
  paginationQueryParamSchemaWithKeywordAndLedgerGroupId,
};
