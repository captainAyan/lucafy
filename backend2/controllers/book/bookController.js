const { StatusCodes } = require("http-status-codes");

const { createSchema } = require("../../utilities/bookValidationSchema");
const bookOrchestratorService = require("../../services/book/bookOrchestratorService");
const bookAccessService = require("../../services/book/bookAccessService");
const { ErrorResponse } = require("../../middlewares/errorMiddleware");

async function createBook(req, res) {
  const { value: bookValues, error } = createSchema.validate(req.body);
  if (error)
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);

  const { book, bookMember } =
    await bookOrchestratorService.createBookWithAdmin(bookValues, req.user.id);

  res.status(StatusCodes.CREATED).json(book);
}

async function getBookById(req, res) {
  const book = await bookAccessService.getBookById(
    req.param.bookId,
    req.user.id
  );
  res.json(book);
}

async function editBook(req, res) {
  res.send("edit book");
}

async function deleteBook(req, res) {
  res.send("delete book");
}

async function getBooksByUser(req, res) {
  const books = await bookAccessService.getBooksUserCanAccess(req.user.id);
  res.json(books);
}

module.exports = {
  createBook,
  getBookById,
  editBook,
  deleteBook,
  getBooksByUser,
};
