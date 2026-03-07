import { z } from "zod";
import { isValidObjectId } from "mongoose";

import { PaginationLimit, PaginationSortOrder } from "../constants/policies.js";

const baseSchema = {
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce
    .number()
    .int()
    .refine((val) =>
      [
        PaginationLimit.TEN,
        PaginationLimit.TWENTY,
        PaginationLimit.FIFTY,
      ].includes(val),
    )
    .default(PaginationLimit.DEFAULT),

  order: z.enum(PaginationSortOrder).default(PaginationSortOrder.NEWEST_FIRST),
};

export const paginationQueryParamSchema = z.object({
  ...baseSchema,
});

export const paginationQueryParamSchemaWithKeyword = z.object({
  ...baseSchema,
  keyword: z.string().nullish().default(""),
});

const objectIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "Invalid ObjectId",
});

export const paginationQueryParamSchemaWithKeywordAndLedgerGroupId = z.object({
  ...baseSchema,
  keyword: z.string().nullish().default(""),
  ledgerGroupId: z.union([objectIdSchema, z.literal("")]).default(""), // TODO only considers mongodb objectId and not other database primary keys
});
