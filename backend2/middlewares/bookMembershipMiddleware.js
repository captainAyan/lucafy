const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const BookService = require("../services/book/bookService");
const BookMemberService = require("../services/book/bookMemberService");
const { ErrorResponse } = require("./errorMiddleware");

async function addBookAndMembershipData(req, res, next) {
  const { bookId } = req.params;

  // Validate bookId format
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new ErrorResponse("Invalid book id", StatusCodes.BAD_REQUEST);
  }

  // Check if user is a member of the book
  const membership = await BookMemberService.getBookMemberByBookIdAndUserId(
    bookId,
    req.user.id
  );

  // Load the book
  const book = await BookService.getBookById(bookId);

  req.book = book;
  req.membership = membership;

  next();
}

function authorizeRole(allowedRoles) {
  return async function authorizeRoleMiddleware(req, res, next) {
    console.log(allowedRoles, req.membership.role);
    if (!allowedRoles.includes(req.membership.role)) {
      throw new ErrorResponse("Insufficient role", StatusCodes.FORBIDDEN);
    }
    next();
  };
}

module.exports = {
  authorizeRole,
  addBookAndMembershipData,
};
