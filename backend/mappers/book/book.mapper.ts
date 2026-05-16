import type Book from "../../domain/book/book.domain.js";
import type BookMember from "../../domain/book/bookMember/bookMember.domain.js";
import type BookResponseDto from "../../dtos/book/bookResponse.dto.js";
import type CreateBookResponseDto from "../../dtos/book/createBookResponse.dto.js";
import type PaginatedBooksResultDto from "../../dtos/book/paginatedBooksResult.dto.js";
import type PaginatedBooksResponseDto from "../../dtos/book/paginatedBooksResponse.dto.js";
import type { BookDocument } from "../../models/mongo/book.model.js";
import { mapBookMemberDomainObjectToBookMembershipResponseDto } from "./bookMember.mapper.js";
import { getSkip } from "../../utilities/paginationHelper.js";

export function mapBookDocumentToBookDomainObject(bookDoc: BookDocument): Book {
  return {
    id: bookDoc._id.toString(),
    organization: bookDoc.organization,
    address: bookDoc.address,
    currencyCode: bookDoc.currencyCode,
    createdAt: bookDoc.createdAt,
    updatedAt: bookDoc.updatedAt,
  };
}

export function mapBookDomainObjectToBookResponseDto(
  book: Book,
): BookResponseDto {
  return {
    id: book.id.toString(),
    organization: book.organization,
    address: book.address,
    currencyCode: book.currencyCode,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}

export function mapBookDomainObjectAndBookMemberDomainObjectToCreateBookResponseDto(
  book: Book,
  member: BookMember,
): CreateBookResponseDto {
  return {
    book: mapBookDomainObjectToBookResponseDto(book),
    membership: mapBookMemberDomainObjectToBookMembershipResponseDto(member),
  };
}

export function mapPaginatedBooksResultDtoToPaginatedBooksResponseDto(
  result: PaginatedBooksResultDto,
): PaginatedBooksResponseDto {
  return {
    page: result.page,
    skip: getSkip(result.page, result.limit),
    total: result.total,
    limit: result.limit,
    order: result.order,
    books: result.books.map(
      (book: Book): BookResponseDto =>
        mapBookDomainObjectToBookResponseDto(book),
    ),
  };
}
