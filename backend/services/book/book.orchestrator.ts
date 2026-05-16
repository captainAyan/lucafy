import mongoose from "mongoose";

import type BookService from "./book.service.js";
import type CreateBookDto from "../../dtos/book/createBook.dto.js";
import { BookMemberRole } from "../../constants/policies.js";
import type BookMemberService from "./bookMember.service.js";
import type Book from "../../domain/book/book.domain.js";
import type BookMember from "../../domain/book/bookMember/bookMember.domain.js";

export default class BookOrchestrator {
  constructor(
    private bookService: BookService,
    private bookMemberService: BookMemberService,
  ) {}

  async createBookWithAdmin(
    bookData: CreateBookDto,
    userId: string,
  ): Promise<{ book: Book; member: BookMember }> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const book: Book = await this.bookService.createBook(bookData, session);

      const member: BookMember = await this.bookMemberService.addMemberToBook(
        { userId, role: BookMemberRole.ADMIN },
        book.id,
        session,
      );

      await session.commitTransaction();

      return { book, member };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
