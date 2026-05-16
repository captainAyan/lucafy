import type BookMember from "../../domain/book/bookMember/bookMember.domain.js";
import type BookMembershipResponseDto from "../../dtos/book/bookMember/bookMembershipResponse.dto.js";
import type { BookMemberDocument } from "../../models/mongo/bookMember.model.js";

export function mapBookMemberDocumentToDomain(
  doc: BookMemberDocument,
): BookMember {
  return {
    id: doc._id.toString(),
    userId: doc.user.toString(),
    bookId: doc.book.toString(),
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function mapBookMemberDomainObjectToBookMembershipResponseDto(
  member: BookMember,
): BookMembershipResponseDto {
  return {
    id: member.id,
    role: member.role,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}
