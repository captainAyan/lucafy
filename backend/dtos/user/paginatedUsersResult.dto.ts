import type {
  PaginationLimit,
  PaginationSortOrder,
} from "../../constants/policies.js";
import type User from "../../domain/user/user.domain.js";

export default interface PaginatedUsersResultDto {
  users: User[];
  page: number;
  total: number;
  limit: PaginationLimit;
  order: PaginationSortOrder;
}
