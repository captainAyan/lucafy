import console from "node:console";

import { Types } from "mongoose";
import type { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

import type { BookMemberRole } from "../constants/policies.js";
import type AuthenticatedRequest from "../types/authenticatedRequest.js";
import type BookMemberRequest from "../types/bookMemberRequest.js";
import type BookService from "../services/book/book.service.js";
import type BookMemberService from "../services/book/bookMember.service.js";
import {
  bookService as containerBookService,
  bookMemberService as containerBookMemberService,
} from "../container.js";

const bookService: BookService = containerBookService;
const bookMemberService: BookMemberService = containerBookMemberService;

export async function addBookAndMembershipData(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const bookId = String(req.params.bookId);

  if (!bookId) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Book Id not provided");
  }
  // Validate bookId format
  if (!Types.ObjectId.isValid(bookId)) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid Book Id");
  }

  // Check if user is a member of the book
  const membership = await bookMemberService.getMemberDetails(
    bookId,
    req.user.id,
  );

  // Load the book
  const book = await bookService.getBookById(bookId, req.user.id);

  req.book = book;
  req.membership = membership;

  next();
}

export function authorizeRole(
  allowedRoles: BookMemberRole[],
): (req: BookMemberRequest, res: Response, next: NextFunction) => void {
  return function authorizeRoleMiddleware(
    req: BookMemberRequest,
    _res: Response,
    next: NextFunction,
  ) {
    console.log("PERMISSION MIDDLEWARE", allowedRoles, req.membership.role);
    if (!allowedRoles.includes(req.membership.role)) {
      throw createHttpError(StatusCodes.UNAUTHORIZED, "Insufficient role");
    }
    next();
  };
}
