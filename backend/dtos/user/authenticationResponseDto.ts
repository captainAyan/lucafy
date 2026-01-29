import type UserResponseDto from "./userResponseDto.js";

export default interface AuthenticationResponseDto {
  user: UserResponseDto;
  token: string;
}
