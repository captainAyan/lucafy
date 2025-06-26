const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../../middlewares/errorMiddleware");
const Book = require("../../models/bookModel");

async function createBook(bookData, session = null) {
  const options = session ? { session } : {};
  const book = await new Book(bookData).save(options);
  return book;
}

async function getBookById(bookId) {
  const book = await Book.findById(bookId);
  if (!book) throw new ErrorResponse("Book not found", StatusCodes.NOT_FOUND);
  return book;
}

async function editBookById(bookId, updateData) {
  /// add 404 check
  return Book.findByIdAndUpdate(bookId, updateData, { new: true });
}

async function deleteBook(bookId) {
  // await BookMember.deleteMany({ book: bookId });
  // await Book.findByIdAndDelete(bookId);
  // return true;
}

module.exports = {
  createBook,
  getBookById,
  deleteBook,
};
