import type {
  PaginationLimit,
  PaginationSortOrder,
} from "../../constants/policies.js";
import type BookResponseDto from "./bookResponse.dto.js";

export default interface PaginatedBooksResponseDto {
  page: number;
  skip: number;
  total: number;
  limit: PaginationLimit;
  order: PaginationSortOrder;
  book: BookResponseDto[];
}
