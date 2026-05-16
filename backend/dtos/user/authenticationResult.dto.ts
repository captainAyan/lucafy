import type User from "../../domain/user/user.domain.js";

export default interface AuthenticationResultDto {
  user: User;
  token: string;
}
