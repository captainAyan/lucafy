const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const bookMemberService = require("../../services/book/bookMemberService");
const {
  createSchema,
  editSchema,
} = require("../../utilities/validation/book/bookMemberSchema");
const {
  paginationQueryParamSchema,
} = require("../../utilities/validation/paginationQueryParamSchema");

async function createBookMember(req, res) {
  const { value: bookMemberValues, error } = createSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const bookMember = await bookMemberService.createBookMember(
    req.book.id,
    bookMemberValues.userId,
    bookMemberValues.role
  );

  res.status(StatusCodes.OK).json(bookMember);
}

async function getBookMembers(req, res) {
  const {
    value: { page, limit, order },
    error,
  } = paginationQueryParamSchema.validate(req.query);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid query parameter");
  }

  const bookMembers = await bookMemberService.getBookMembersByBookId(
    req.book.id,
    page,
    limit,
    order
  );
  res.status(StatusCodes.OK).json(bookMembers);
}

async function getBookMemberById(req, res) {
  const bookMember =
    await bookMemberService.getBookMemberByBookIdAndBookMemberId(
      req.book.id,
      req.params.memberId
    );
  res.status(StatusCodes.OK).json(bookMember);
}

async function editBookMember(req, res) {
  const { value: bookMemberValues, error } = editSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const bookMember =
    await bookMemberService.editBookMemberByBookIdAndBookMemberId(
      req.book.id,
      req.params.memberId,
      bookMemberValues
    );

  res.status(StatusCodes.OK).json(bookMember);
}

async function deleteBookMember(req, res) {
  res.send("delete member");
}

module.exports = {
  createBookMember,
  getBookMembers,
  getBookMemberById,
  editBookMember,
  deleteBookMember,
};
