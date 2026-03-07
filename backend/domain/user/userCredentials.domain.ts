import type User from "./user.domain.js";

export default interface UserCredentials {
  user: User;
  password: string;
}
