const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../../middlewares/errorMiddleware");
const BookMember = require("../../models/bookMemberModel");

async function getBookMemberByBookIdAndUserId(bookId, userId) {
  const member = await BookMember.findOne({
    user: userId,
    book: bookId,
  }).populate("user");
  if (!member) {
    throw new ErrorResponse("Book member not found", StatusCodes.NOT_FOUND);
  }

  return member;
}

async function createBookMember(bookId, userId, role, session = null) {
  const options = session ? { session } : {};

  try {
    await getBookMemberByBookIdAndUserId(bookId, userId);
    throw new ErrorResponse(
      "Book Member already exists",
      StatusCodes.FORBIDDEN
    );
  } catch (err) {
    if (err.status === StatusCodes.NOT_FOUND) {
      const member = await new BookMember({
        book: bookId,
        user: userId,
        role,
      }).save(options);
      return member;
    }
    throw err;
  }
}

async function getBookMembersByBookId(bookId) {
  const members = await BookMember.find({ book: bookId }).populate("user");
  return members;
}

async function getBookMemberByBookIdAndBookMemberId(bookId, bookMemberId) {
  const member = await BookMember.findOne({
    _id: bookMemberId,
    book: bookId,
  }).populate("user");

  if (!member) {
    throw new ErrorResponse("Book member not found", StatusCodes.NOT_FOUND);
  }

  return member;
}

async function editBookMemberByBookIdAndBookMemberId(
  bookId,
  bookMemberId,
  bookMemberData
) {
  const bookMember = await getBookMemberByBookIdAndBookMemberId(
    bookId,
    bookMemberId
  );
  Object.assign(bookMember, bookMemberData);
  await bookMember.save();
  return bookMember;
}

// TODO 😬😬
async function getBooksByUser(userId) {
  const members = await BookMember.find({ user: userId })
    .populate("book")
    .select("-user");

  // const x = members.map((m) => m.book);
  // return x;
  return members;
}

module.exports = {
  getBookMemberByBookIdAndUserId,
  createBookMember,
  getBookMembersByBookId,
  getBookMemberByBookIdAndBookMemberId,
  editBookMemberByBookIdAndBookMemberId,
  getBooksByUser,
};
