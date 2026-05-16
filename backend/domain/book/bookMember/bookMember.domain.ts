import type { BookMemberRole } from "../../../constants/policies.js";

export default interface BookMember {
  id: string;
  userId: string;
  bookId: string;
  role: BookMemberRole;
  createdAt: Date;
  updatedAt: Date;
}
