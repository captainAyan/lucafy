import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

import {
  createBookSchema,
  editBookSchema,
} from "../../validators/book/book.schema.js";
import { paginationQueryParamSchema } from "../../validators/paginationQueryParam.schema.js";
import type AuthenticatedRequest from "../../types/authenticatedRequest.js";
import BookOrchestrator from "../../services/book/book.orchestrator.js";
import {
  bookService as containerBookService,
  bookMemberService as containerBookMemberService,
} from "../../container.js";
import type BookService from "../../services/book/book.service.js";
import type CreateBookDto from "../../dtos/book/createBook.dto.js";
import type BookMemberService from "../../services/book/bookMember.service.js";
import {
  mapBookDomainObjectAndBookMemberDomainObjectToCreateBookResponseDto,
  mapBookDomainObjectToBookResponseDto,
  mapPaginatedBooksResultDtoToPaginatedBooksResponseDto,
} from "../../mappers/book/book.mapper.js";
import type PaginationOptions from "../../types/paginationOptions.js";
import type PaginatedBooksResultDto from "../../dtos/book/paginatedBooksResult.dto.js";
import type PaginatedBooksResponseDto from "../../dtos/book/paginatedBooksResponse.dto.js";
import type BookMemberRequest from "../../types/bookMemberRequest.js";
import type CreateBookResponseDto from "../../dtos/book/createBookResponse.dto.js";
import type BookResponseDto from "../../dtos/book/bookResponse.dto.js";
import type Book from "../../domain/book/book.domain.js";
import type EditBookDto from "../../dtos/book/editBook.dto.js";

const bookService: BookService = containerBookService;
const bookMemberService: BookMemberService = containerBookMemberService;

export async function createBook(req: AuthenticatedRequest, res: Response) {
  const result = createBookSchema.safeParse(req.body);
  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const data: CreateBookDto = result.data;

  const bookOrchestrator: BookOrchestrator = new BookOrchestrator(
    bookService,
    bookMemberService,
  );
  const { book, member } = await bookOrchestrator.createBookWithAdmin(
    data,
    req.user.id,
  );

  const response: CreateBookResponseDto =
    mapBookDomainObjectAndBookMemberDomainObjectToCreateBookResponseDto(
      book,
      member,
    );

  res.status(StatusCodes.CREATED).json(response);
}

export async function getBookById(req: AuthenticatedRequest, res: Response) {
  const bookId: string = String(req.params.bookId);
  const book: Book = await bookService.getBookById(bookId, req.user.id);
  const response: BookResponseDto = mapBookDomainObjectToBookResponseDto(book);

  res.status(StatusCodes.OK).json(response);
}

export async function getBooksByUser(req: AuthenticatedRequest, res: Response) {
  const result = paginationQueryParamSchema.safeParse(req.query);
  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid query parameter");
  }

  const { page, limit, order } = result.data;
  const paginationOptions: PaginationOptions = { page, limit, order };

  const userId = req.user.id;

  const paginatedResultDto: PaginatedBooksResultDto =
    await bookMemberService.getBooksByUserPaginated(userId, paginationOptions);

  const response: PaginatedBooksResponseDto =
    mapPaginatedBooksResultDtoToPaginatedBooksResponseDto(paginatedResultDto);

  res.status(StatusCodes.OK).json(response);
}

export async function editBook(req: BookMemberRequest, res: Response) {
  const result = editBookSchema.safeParse(req.body);
  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const data: EditBookDto = result.data;

  const book = await bookService.updateBookById(req.book.id, data);
  res.status(StatusCodes.OK).json(book);
}

export function deleteBook(req: BookMemberRequest, res: Response) {
  res.send("delete book");
}
