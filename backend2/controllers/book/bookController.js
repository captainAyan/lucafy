const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const {
  createSchema,
  editSchema,
} = require("../../utilities/validation/bookSchema");
const bookOrchestratorService = require("../../services/book/bookOrchestratorService");
const bookAccessService = require("../../services/book/bookAccessService");
const bookService = require("../../services/book/bookService");
const {
  paginationQueryParamSchema,
} = require("../../utilities/validation/paginationQueryParamSchema");

async function createBook(req, res) {
  const { value: bookValues, error } = createSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const { book, bookMember } =
    await bookOrchestratorService.createBookWithAdmin(bookValues, req.user.id);

  res.status(StatusCodes.CREATED).json(book);
}

async function getBookById(req, res) {
  const book = await bookService.getBookById(req.book.id);
  res.status(StatusCodes.OK).json(book);
}

async function getBooksByUser(req, res) {
  const {
    value: { page, limit, order },
    error,
  } = paginationQueryParamSchema.validate(req.query);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid query parameter");
  }

  const books = await bookAccessService.getBooksUserCanAccess(
    req.user.id,
    page,
    limit,
    order
  );
  res.status(StatusCodes.OK).json(books);
}

async function editBook(req, res) {
  const { value: bookValues, error } = editSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const book = await bookService.editBookById(req.book.id, bookValues);
  res.status(StatusCodes.OK).json(book);
}

async function deleteBook(req, res) {
  res.send("delete book");
}

module.exports = {
  createBook,
  getBookById,
  getBooksByUser,
  editBook,
  deleteBook,
};
