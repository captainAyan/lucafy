import type { ClientSession } from "mongoose";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import type { BookMemberRole } from "../../constants/policies.js";
import type BookRepository from "../../domain/book/book.repository.js";
import type BookMember from "../../domain/book/bookMember/bookMember.domain.js";
import type BookMemberRepository from "../../domain/book/bookMember/bookMember.repository.js";
import type CreateBookMemberDto from "../../dtos/book/bookMember/createBookMember.dto.js";
import type UserRepository from "../../domain/user/user.repository.js";
import type User from "../../domain/user/user.domain.js";
import type PaginationOptions from "../../types/paginationOptions.js";
import type PaginatedBooksResultDto from "../../dtos/book/paginatedBooksResult.dto.js";
import type EditBookMemberDto from "../../dtos/book/bookMember/editBookMember.dto.js";

export default class BookMemberService {
  constructor(
    private readonly bookMemberRepo: BookMemberRepository,
    private readonly bookRepo: BookRepository, // Needed to verify book existence
    private readonly userRepo: UserRepository,
  ) {}

  /**
   * Enrollment & Invites
   */
  async addMemberToBook(
    memberData: CreateBookMemberDto,
    bookId: string,
    session: ClientSession | null = null,
  ): Promise<BookMember> {
    const user: User | null = await this.userRepo.findById(memberData.userId);
    if (!user) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Member user not found");
    }

    const member: BookMember | null = await this.bookMemberRepo.addMember(
      bookId,
      {
        userId: memberData.userId,
        role: memberData.role,
      },
      session,
    );

    return member;
  }

  async addBulkMembers(
    bookId: string,
    members: { userId: string; role: BookMemberRole }[],
  ): Promise<BookMember[]> {
    return this.bookMemberRepo.addMembers(members, bookId);
  }

  /**
   * Removal Logic
   */
  async removeMemberFromBook(bookId: string, userId: string): Promise<void> {
    const removed = await this.bookMemberRepo.removeMember(userId, bookId);

    if (!removed) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Member not found");
    }
  }

  async removeBulkMembers(bookId: string, userIds: string[]): Promise<void> {
    await this.bookMemberRepo.removeMembers(userIds, bookId);
  }

  /**
   * Role Management
   */
  async updateMemberRole(
    bookId: string,
    userId: string,
    memberData: EditBookMemberDto,
  ): Promise<BookMember> {
    const membership = await this.bookMemberRepo.findByUserAndBook(
      userId,
      bookId,
    );

    if (!membership) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Member not found");
    }

    // assuming you’ll add repo method later
    const updated = await this.bookMemberRepo.updateMember(
      userId,
      bookId,
      memberData,
    );

    return updated;
  }

  /**
   * Queries & Data Fetching
   */

  async getBookMembers(
    bookId: string,
    options: PaginationOptions,
  ): Promise<BookMember[]> {
    // TODO add pagination output
    return this.bookMemberRepo.getMembersByBookPaginated(bookId, options);
  }

  async getUserMemberships(
    userId: string,
    options: PaginationOptions,
  ): Promise<BookMember[]> {
    // TODO add pagination output
    // you don’t currently have this in repo → reuse IDs approach
    // const bookIds = await this.bookMemberRepo.getBookIdsByUserPaginated(
    //   userId,
    //   options,
    // );
    // if (!bookIds.length) return [];
    // // fetch memberships again (simple but consistent)
    // const memberships = await Promise.all(
    //   bookIds.map((bookId) =>
    //     this.bookMemberRepo.findByUserAndBook(userId, bookId),
    //   ),
    // );
    // return memberships.filter(Boolean) as BookMember[];
  }

  async getBooksByUserPaginated(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedBooksResultDto> {
    const bookIds = await this.bookMemberRepo.getBookIdsByUserPaginated(
      userId,
      options,
    );

    const books = bookIds.length ? await this.bookRepo.findByIds(bookIds) : [];

    const total: number = await this.bookMemberRepo.countBooks(userId);

    return { books, total, ...options };
  }

  async getMemberDetails(bookId: string, userId: string): Promise<BookMember> {
    const membership = await this.bookMemberRepo.findByUserAndBook(
      userId,
      bookId,
    );

    if (!membership) {
      throw createHttpError(StatusCodes.NOT_FOUND, "Member not found");
    }

    return membership;
  }

  async isUserInBook(userId: string, bookId: string): Promise<boolean> {
    return this.bookMemberRepo.isMember(userId, bookId);
  }

  async verifyMemberRole(
    userId: string,
    bookId: string,
    requiredRole: BookMemberRole,
  ): Promise<boolean> {
    const membership = await this.bookMemberRepo.findByUserAndBook(
      userId,
      bookId,
    );

    if (!membership) return false;

    return membership.role === requiredRole;
  }

  /**
   * Statistics
   */
  async getBookMemberCount(bookId: string): Promise<number> {
    return this.bookMemberRepo.countMembers(bookId);
  }

  /**
   * Internal/System Cleanup
   * Usually called by BookService during a deleteBook cascade
   */
  async deleteAllMembersFromBook(
    bookId: string,
    session?: ClientSession,
  ): Promise<void>;
}
