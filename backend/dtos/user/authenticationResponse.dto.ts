import type UserResponseDto from "./userResponse.dto.js";

export default interface AuthenticationResponseDto {
  user: UserResponseDto;
  token: string;
}
