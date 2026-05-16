import type { BookMemberRole } from "../../../constants/policies.js";

// book membership repsonse is reflecting the user's role in the book
export default interface BookMembershipResponseDto {
  id: string;
  role: BookMemberRole;
  createdAt?: string;
  updatedAt?: string;
}
