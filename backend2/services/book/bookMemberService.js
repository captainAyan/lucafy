const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const BookMember = require("../../models/bookMemberModel");
const { getUserById } = require("../userService");

/**
 * @typedef {import('../constants/typedefs').BookMember} BookMember
 */

/**
 * Retrives BookMember by bookId and userId
 *
 * @param {string} bookId - MongoDB ObjectId of the book
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {promise<BookMember>}
 */
async function getBookMemberByBookIdAndUserId(bookId, userId) {
  const member = await BookMember.findOne({
    user: userId,
    book: bookId,
  }).populate([{ path: "user" }, { path: "book" }]);

  if (!member) {
    throw createHttpError(StatusCodes.NOT_FOUND, "Book member not found");
  }

  return member;
}

/**
 * Retrives BookMember by bookId and bookMemberId
 *
 * @param {string} bookId - MongoDB ObjectId of the book
 * @param {string} bookMemberId - MongoDB ObjectId of the bookMember
 * @returns {Promise<BookMember>}
 */
async function getBookMemberByBookIdAndBookMemberId(
  bookId,
  bookMemberId,
  session
) {
  const member = await BookMember.findOne({
    _id: bookMemberId,
    book: bookId,
  })
    .session(session || undefined)
    .populate([{ path: "user" }, { path: "book" }]);

  if (!member) {
    throw createHttpError(StatusCodes.NOT_FOUND, "Book member not found");
  }

  return member;
}

/**
 * Retrives pagianted list of book memberships of an user by their user id
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {number} page - Current page number
 * @param {number} limit - Number of users per page
 * @param {string} order - Sort order
 * @returns {Promise<{
 *  skip: number,
 *  limit: number,
 *  total: number,
 *  memberships: Array<BookMember>
 * }>}
 */
async function getBookMembershipsByUserId(userId, page, limit, order) {
  const sortOrder = order === "oldest" ? "createdAt" : "-createdAt";

  const total = await BookMember.countDocuments({ user: userId });

  const memberships = await BookMember.find({ user: userId })
    .sort(sortOrder)
    .skip(page * limit)
    .limit(limit)
    .populate([{ path: "user" }, { path: "book" }]);

  return {
    skip: page * limit,
    limit,
    total,
    memberships,
  };
}

/**
 * Retrive paginated list of BookMembers of a book by it's book id
 *
 * @param {string} bookId - MongoDB ObjectId of the book
 * @param {number} page - Current page number
 * @param {number} limit - Number of users per page
 * @param {string} order - Sort order
 * @returns {Promise<{
 *  skip: number,
 *  limit: number,
 *  total: number,
 *  members: Array<BookMember>
 * }>}
 */
async function getBookMembersByBookId(bookId, page, limit, order) {
  const sortOrder = order === "oldest" ? "createdAt" : "-createdAt";

  const total = await BookMember.countDocuments({ book: bookId });

  const members = await BookMember.find({ book: bookId })
    .sort(sortOrder)
    .skip(page * limit)
    .limit(limit)
    .populate([{ path: "user" }, { path: "book" }]);

  return { skip: page * limit, limit, total, members };
}

/**
 * Create BookMember
 *
 * @param {string} bookId - MongoDB ObjectId of book
 * @param {string} userId - MongoDB ObjectId of user
 * @param {string} role - Member role
 * @param {import('mongoose').ClientSession} [session=null] - Optional MongoDB session for transaction support.
 * @returns {Promise<BookMember>} - The created BookMember document
 */
async function createBookMember(bookId, userId, role, session = null) {
  const options = session ? { session } : {};

  try {
    const user = await getUserById(userId);

    const member = await new BookMember({
      book: bookId,
      user: userId,
      role,
    }).save(options);
    return await getBookMemberByBookIdAndBookMemberId(
      bookId,
      member.id,
      session
    );
  } catch (err) {
    if (err.code === 11000) {
      throw createHttpError(
        StatusCodes.FORBIDDEN,
        "Book member already exists"
      );
    }
    throw err;
  }
}

/**
 * Update BookMember data
 *
 * @param {string} bookId - MongoDB ObjectId of the book
 * @param {string} bookMemberId - MongoDB ObjectId of the bookMember
 * @param {Partial<BookMember>} bookMemberData - An object containing the fields to update
 * @returns {Promise<BookMember>} The updated BookMember document
 */
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

module.exports = {
  getBookMemberByBookIdAndUserId,
  createBookMember,
  getBookMembersByBookId,
  getBookMemberByBookIdAndBookMemberId,
  editBookMemberByBookIdAndBookMemberId,
  getBookMembershipsByUserId,
};
