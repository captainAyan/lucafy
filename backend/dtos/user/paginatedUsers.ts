import type { SortOrder } from "../../constants/policies.js";
import type UserResponseDto from "./userResponseDto.js";

export default interface PaginatedUsersDto {
  page: number;
  skip: number;
  total: number;
  limit: number;
  order: SortOrder;
  users: UserResponseDto[];
}
