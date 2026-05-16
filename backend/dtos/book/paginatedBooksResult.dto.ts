import type {
  PaginationLimit,
  PaginationSortOrder,
} from "../../constants/policies.js";
import type Book from "../../domain/book/book.domain.js";

export default interface PaginatedBooksResultDto {
  books: Book[];
  page: number;
  total: number;
  limit: PaginationLimit;
  order: PaginationSortOrder;
}
