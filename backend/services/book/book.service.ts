import type { ClientSession } from "mongoose";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import type Book from "../../domain/book/book.domain.js";
import type CreateBookDto from "../../dtos/book/createBook.dto.js";
import type EditBookDto from "../../dtos/book/editBook.dto.js";
import type BookRepository from "../../domain/book/book.repository.js";
import type BookMemberService from "./bookMember.service.js";
import type PaginationOptions from "../../types/paginationOptions.js";
import type PaginatedBooksResultDto from "../../dtos/book/paginatedBooksResult.dto.js";

export default class BookService {
  constructor(
    private readonly bookRepo: BookRepository,
    private readonly bookMemberService: BookMemberService,
  ) {}

  async createBook(
    bookData: CreateBookDto,
    session: ClientSession | null = null,
  ): Promise<Book> {
    const book = await this.bookRepo.create(bookData, session);

    if (!book) {
      throw createHttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create book",
      );
    }

    return book;
  }

  async getBookById(bookId: string, userId: string): Promise<Book> {
    const book: Book | null = await this.bookRepo.findById(bookId);

    if (!book) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Book not found");
    }

    const isMember: boolean = await this.bookMemberService.isUserInBook(
      userId,
      bookId,
    );

    if (!isMember) {
      throw createHttpError(
        StatusCodes.FORBIDDEN,
        "You do not have access to this book",
      );
    }

    return book;
  }

  async getBooksByIds(bookIds: string[]): Promise<Book[]> {
    if (!bookIds.length) return [];
    return this.bookRepo.findByIds(bookIds);
  }

  async getAllBooksPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedBooksResultDto> {
    const books: Book[] = await this.bookRepo.findAllPaginated(options);
    const total: number = await this.bookRepo.count();

    return { books, total, ...options };
  }

  async getBookCount(): Promise<number> {
    return this.bookRepo.count();
  }

  async updateBookById(
    bookId: string,
    bookData: Partial<EditBookDto>,
  ): Promise<Book> {
    const updated = await this.bookRepo.updateById(bookId, bookData);

    if (!updated) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Book not found");
    }

    return updated;
  }

  async bookExists(bookId: string): Promise<boolean> {
    return this.bookRepo.exists(bookId);
  }

  async deleteBook(bookId: string): Promise<void> {
    const exists = await this.bookRepo.exists(bookId);

    if (!exists) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Book not found");
    }

    // delete logic goes here
  }
}
