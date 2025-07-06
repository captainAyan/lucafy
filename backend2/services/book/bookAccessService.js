const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../../middlewares/errorMiddleware");
const bookMemberService = require("./bookMemberService");
const bookService = require("./bookService");
const { BOOK_MEMBER_ROLE } = require("../../constants/policies");

async function getBooksUserCanAccess(userId) {
  return bookMemberService.getBooksByUser(userId);
}

async function getPermissionByBookId(bookId, userId) {
  try {
    return await bookMemberService.getBookMembership(userId, bookId);
  } catch (err) {
    if (err.status === StatusCodes.NOT_FOUND)
      throw new ErrorResponse("No permission", StatusCodes.FORBIDDEN);
    else throw err;
  }
}

module.exports = {
  getBooksUserCanAccess,
  getPermissionByBookId,
};
