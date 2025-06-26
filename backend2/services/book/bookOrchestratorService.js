const mongoose = require("mongoose");

const bookService = require("./bookService");
const bookMemberService = require("./bookMemberService");
const { BOOK_MEMBER_ROLE } = require("../../constants/policies");

async function createBookWithAdmin(bookData, userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await bookService.createBook(bookData, session);

    const bookMember = await bookMemberService.createBookMember(
      {
        book: book.id,
        user: userId,
        role: BOOK_MEMBER_ROLE.ADMIN,
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return { book, bookMember };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = {
  createBookWithAdmin,
};
