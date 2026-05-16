import type { PaginationLimit } from "../constants/policies.js";
import { PaginationSortOrder } from "../constants/policies.js";

export function getSortOrder(order: PaginationSortOrder): string {
  return {
    [PaginationSortOrder.OLDEST_FIRST]: "createdAt",
    [PaginationSortOrder.NEWEST_FIRST]: "-createdAt",
  }[order];
}

export function getSkip(page: number, limit: PaginationLimit): number {
  return Math.max(0, (page - 1) * limit);
}
