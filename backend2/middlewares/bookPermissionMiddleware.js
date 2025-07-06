const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const BookService = require("../services/book/bookService");
const BookMemberService = require("../services/book/bookMemberService");
const { ErrorResponse } = require("./errorMiddleware");

function getBookPermissionMiddleware(allowedRoles) {
  return async function bookPermissionMiddleware(req, res, next) {
    const { bookId } = req.params;

    // Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new ErrorResponse("Invalid book id", StatusCodes.BAD_REQUEST);
    }

    // Check if user is a member of the book
    const membership = await BookMemberService.getMembershipByBookIdAndUserId(
      bookId,
      req.user.id
    );

    // check if the role is insufficient
    if (!allowedRoles.includes(membership.role)) {
      throw new ErrorResponse("Insufficient role", StatusCodes.FORBIDDEN);
    }

    // Load the book
    const book = await BookService.getBookById(bookId);

    req.book = book;
    req.membership = membership; // TODO don't know if the is even required

    return next();
  };
}

module.exports = getBookPermissionMiddleware;
