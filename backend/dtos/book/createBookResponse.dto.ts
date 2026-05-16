import type BookMembershipResponseDto from "./bookMember/bookMembershipResponse.dto.js";
import type BookResponseDto from "./bookResponse.dto.js";

export default interface CreateBookResponseDto {
  book: BookResponseDto;
  membership: BookMembershipResponseDto;
}
