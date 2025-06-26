const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../../middlewares/errorMiddleware");
const bookMemberService = require("./bookMemberService");
const bookService = require("./bookService");

async function getBooksUserCanAccess(userId) {
  return bookMemberService.getBooksByUser(userId);
}

async function getBookById(bookId, userId) {
  try {
    await bookMemberService.getBookMembership(userId, bookId);
  } catch (err) {
    if (err.status === 404)
      throw new ErrorResponse("No permission", StatusCodes.FORBIDDEN);
    else throw err;
  }

  const book = await bookService.getBookById(bookId);
  return book;
}

module.exports = {
  getBooksUserCanAccess,
  getBookById,
};
