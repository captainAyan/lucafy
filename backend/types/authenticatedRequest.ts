import type { Request } from "express";
import type User from "../domain/user/user.domain.js";

export default interface AuthenticatedRequest extends Request {
  user: User;
}
