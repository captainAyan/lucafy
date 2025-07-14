const { StatusCodes } = require("http-status-codes");

const bookMemberService = require("../../services/book/bookMemberService");
const { ErrorResponse } = require("../../middlewares/errorMiddleware");
const {
  createSchema,
  editSchema,
} = require("../../utilities/validation/bookMemberValidationSchema");

async function createBookMember(req, res) {
  const { value: bookMemberValues, error } = createSchema.validate(req.body);
  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const bookMember = await bookMemberService.createBookMember(
    req.book.id,
    bookMemberValues.user_id,
    bookMemberValues.role
  );

  res.status(StatusCodes.OK).json(bookMember);
}

async function getBookMembers(req, res) {
  const bookMembers = await bookMemberService.getBookMembersByBookId(
    req.book.id
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
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
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
