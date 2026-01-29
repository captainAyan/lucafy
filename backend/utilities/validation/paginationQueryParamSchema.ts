import Joi from "joi";
import joiObjectid from "joi-objectid";

import {
  DEFAULT_PAGINATION_LIMIT,
  SortOrder,
} from "../../constants/policies.js";

const objectId = joiObjectid(Joi);

const baseSchema = {
  page: Joi.number().integer().min(0).default(0),
  limit: Joi.number()
    .integer()
    .valid(DEFAULT_PAGINATION_LIMIT, 20, 50)
    .default(DEFAULT_PAGINATION_LIMIT),
  order: Joi.string()
    .valid(SortOrder.NEWEST_FIRST, SortOrder.OLDEST_FIRST)
    .default(SortOrder.NEWEST_FIRST),
};

const schemaOptions = { stripUnknown: true, convert: true };

export const paginationQueryParamSchema = Joi.object({
  ...baseSchema,
}).options(schemaOptions);

export const paginationQueryParamSchemaWithKeyword = Joi.object({
  ...baseSchema,
  keyword: Joi.string().allow("", null),
}).options(schemaOptions);

export const paginationQueryParamSchemaWithKeywordAndLedgerGroupId = Joi.object(
  {
    ...baseSchema,
    keyword: Joi.string().allow("", null),
    ledgerGroupId: objectId().allow("").default(""),
  },
).optional(schemaOptions);
