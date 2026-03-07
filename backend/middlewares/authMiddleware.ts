import process from "process";

import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

import { userService as containerUserService } from "../container.js";
import type UserService from "../services/user.service.js";
import type User from "../domain/user/user.domain.js";

const userService: UserService = containerUserService;

export default async function protect(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

      // check if the decoded payload has teh key "id"
      if (typeof decoded === "string" || !("id" in decoded)) {
        throw createHttpError(StatusCodes.UNAUTHORIZED, "Invalid token");
      }

      const userId = decoded.id;

      const user: User = await userService.getUserById(userId);
      req.user = user;

      next();
    } catch (err) {
      throw createHttpError(StatusCodes.UNAUTHORIZED, "Not authenticated");
    }
  } else {
    throw createHttpError(StatusCodes.UNAUTHORIZED, "Not authenticated");
  }
}
