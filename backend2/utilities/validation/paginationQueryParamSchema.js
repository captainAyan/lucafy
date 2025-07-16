const Joi = require("joi");

const { DEFAULT_PAGINATION_LIMIT } = require("../../constants/policies");

const paginationQueryParamSchemaWithKeyword = Joi.object({
  page: Joi.number().integer().min(0).default(0),
  limit: Joi.number()
    .valid(DEFAULT_PAGINATION_LIMIT, 20, 50)
    .default(DEFAULT_PAGINATION_LIMIT),
  order: Joi.string().valid("oldest", "newest").default("newest"),
  keyword: Joi.string().allow("", null),
}).options({
  stripUnknown: true,
  convert: true,
});

const paginationQueryParamSchema = Joi.object({
  page: Joi.number().integer().min(0).default(0),
  limit: Joi.number()
    .valid(DEFAULT_PAGINATION_LIMIT, 20, 50)
    .default(DEFAULT_PAGINATION_LIMIT),
  order: Joi.string().valid("oldest", "newest").default("newest"),
}).options({
  stripUnknown: true,
  convert: true,
});

module.exports = {
  paginationQueryParamSchemaWithKeyword,
  paginationQueryParamSchema,
};
