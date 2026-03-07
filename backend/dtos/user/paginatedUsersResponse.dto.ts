import type { PaginationSortOrder } from "../../constants/policies.js";
import type UserResponseDto from "./userResponse.dto.js";

export default interface PaginatedUsersResponseDto {
  page: number;
  skip: number;
  total: number;
  limit: number;
  order: PaginationSortOrder;
  users: UserResponseDto[];
}
