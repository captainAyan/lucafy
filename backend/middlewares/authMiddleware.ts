import process from "process";

import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

import { getUserById } from "../services/userService.js";

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

      const user = await getUserById(decoded.id);
      req.user = user;

      next();
    } catch (err) {
      throw createHttpError(StatusCodes.UNAUTHORIZED, "Not authenticated");
    }
  } else {
    throw createHttpError(StatusCodes.UNAUTHORIZED, "Not authenticated");
  }
}
