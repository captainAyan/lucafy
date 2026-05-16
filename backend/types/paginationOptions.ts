import type {
  PaginationLimit,
  PaginationSortOrder,
} from "../constants/policies.js";

type PaginationOptions = {
  page: number;
  limit: PaginationLimit;
  order: PaginationSortOrder;
};

export default PaginationOptions;
