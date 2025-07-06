const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../../middlewares/errorMiddleware");
const BookMember = require("../../models/bookMemberModel");

async function createBookMember(bookMemberData, session = null) {
  const options = session ? { session } : {};
  const member = await new BookMember(bookMemberData).save(options);
  return member;
}

async function getMembershipByBookIdAndUserId(bookId, userId) {
  const member = await BookMember.findOne({ user: userId, book: bookId });
  if (!member) {
    throw new ErrorResponse("Book member not found", StatusCodes.NOT_FOUND);
  }

  return member;
}

async function getBooksByUser(userId) {
  const members = await BookMember.find({ user: userId })
    .populate("book")
    .select("-user");
  return members;
}

async function getBookMembership(userId, bookId) {
  const member = await BookMember.findOne({ user: userId, book: bookId })
    .populate("book")
    .select("-user");
  if (!member)
    throw new ErrorResponse("Book member not found", StatusCodes.NOT_FOUND);
  return member;
}

module.exports = {
  createBookMember,
  getMembershipByBookIdAndUserId,
  getBooksByUser,
  getBookMembership,
};
