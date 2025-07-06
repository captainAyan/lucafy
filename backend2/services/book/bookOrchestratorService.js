const mongoose = require("mongoose");

const bookService = require("./bookService");
const bookMemberService = require("./bookMemberService");
const { BOOK_MEMBER_ROLE } = require("../../constants/policies");

/**
 * @typedef {import('../../constants/typedefs').Book} Book
 */

/**
 * Orchestrates the creation of a new Book and assigns the given user as its admin.
 *
 * This method wraps the process of creating a Book and linking it to an admin user.
 *
 * @param {Object} bookData - The data required to create the Book document.
 * @param {string} userId - The MongoDB ObjectId of the user to be assigned as the book's admin.
 * @returns {Promise<Book>} - The created Book document.
 */

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
