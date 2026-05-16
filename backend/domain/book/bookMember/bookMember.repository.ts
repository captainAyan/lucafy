import type { ClientSession } from "mongoose";
import type { BookMemberRole } from "../../../constants/policies.js";
import type PaginationOptions from "../../../types/paginationOptions.js";
import type BookMember from "./bookMember.domain.js";

export default interface BookMemberRepository {
  // Add
  addMember(
    bookId: string,
    memberData: {
      userId: string;
      role: BookMemberRole;
    },
    session: ClientSession | null,
  ): Promise<BookMember>;

  addMembers(
    membersData: { userId: string; role: BookMemberRole }[],
    bookId: string,
  ): Promise<BookMember[]>;

  // Remove
  removeMember(userId: string, bookId: string): Promise<boolean>;

  removeMembers(userIds: string[], bookId: string): Promise<boolean>;

  // Cascade helper (VERY IMPORTANT)
  removeByBookId(bookId: string): Promise<boolean>;

  removeByUserId(userId: string): Promise<boolean>;

  updateMember(
    userId: string,
    bookId: string,
    memberData: {
      role: BookMemberRole;
    },
  ): Promise<BookMember | null>;

  // Checks
  isMember(userId: string, bookId: string): Promise<boolean>;

  // Read (IDs only — keep repo clean)
  getBookIdsByUser(userId: string): Promise<string[]>;

  getUserIdsByBook(bookId: string): Promise<string[]>;

  // Pagination (IMPORTANT: pagination lives here)
  getBookIdsByUserPaginated(
    userId: string,
    options: PaginationOptions,
  ): Promise<string[]>;

  getUserIdsByBookPaginated(
    bookId: string,
    options: PaginationOptions,
  ): Promise<string[]>;

  // Fetch relationship entities (when needed)
  getMembersByBookPaginated(
    bookId: string,
    options: PaginationOptions,
  ): Promise<BookMember[]>;

  getMembersByBook(bookId: string): Promise<BookMember[]>;

  findByUserAndBook(userId: string, bookId: string): Promise<BookMember | null>;

  // Counts
  countMembers(groupId: string): Promise<number>;

  countBooks(userId: string): Promise<number>;
}
