import type AuthenticatedRequest from "./authenticatedRequest.js";
import type Book from "../domain/book/book.domain.js";
import type BookMember from "../domain/book/bookMember/bookMember.domain.js";

export default interface BookMemberRequest extends AuthenticatedRequest {
  book: Book;
  membership: BookMember;
}
