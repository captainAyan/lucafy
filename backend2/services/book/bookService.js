const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../../middlewares/errorMiddleware");
const Book = require("../../models/bookModel");

/**
 * @typedef {import('../../constants/typedefs').Book} Book
 */

/**
 * Creates a new Book document in the database.
 *
 * @param {Object} bookData - The data for the new book.
 * @param {import('mongoose').ClientSession} [session=null] - Optional MongoDB session for transaction support.
 * @returns {Promise<Book>} - The created Book document.
 */
async function createBook(bookData, session = null) {
  const options = session ? { session } : {};
  const book = await new Book(bookData).save(options);
  return book;
}

/**
 * Retrieves a Book document by its MongoDB ObjectId.
 *
 * @param {string} bookId - The MongoDB ObjectId of the book to retrieve.
 * @returns {Promise<Book>} - The Book document if found, otherwise null.
 */
async function getBookById(bookId) {
  const book = await Book.findById(bookId);
  if (!book) throw new ErrorResponse("Book not found", StatusCodes.NOT_FOUND);
  return book;
}

/**
 * Updates an existing Book document by its MongoDB ObjectId.
 *
 * @param {string} bookId - The MongoDB ObjectId of the book to update.
 * @param {Partial<Book>} bookData - An object containing the fields to update.
 * @returns {Promise<Book>} - The updated Book document if found, otherwise null.
 */
async function editBookById(bookId, bookData) {
  const book = await getBookById(bookId);
  Object.assign(book, bookData);
  await book.save();
  return book;
}

/**
 * Deletes a Book document by its MongoDB ObjectId.
 *
 * @param {string} bookId - The MongoDB ObjectId of the book to delete.
 * @returns {Promise<Book>} - The deleted Book document if it existed, otherwise null.
 */
async function deleteBook(bookId) {
  // await BookMember.deleteMany({ book: bookId });
  // await Book.findByIdAndDelete(bookId);
  // return true;
}

module.exports = {
  createBook,
  getBookById,
  editBookById,
  deleteBook,
};
