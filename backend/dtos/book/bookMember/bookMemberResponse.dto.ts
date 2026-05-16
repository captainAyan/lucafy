import type { BookMemberRole } from "../../../constants/policies.js";
import type UserPreviewDto from "../../user/userPreviewResponse.dto.js";

// book member repsonse is reflecting roles of any member of the book
export default interface BookMemberResponseDto {
  id: string;
  role: BookMemberRole;
  user: UserPreviewDto;
  createdAt?: string;
  updatedAt?: string;
}
