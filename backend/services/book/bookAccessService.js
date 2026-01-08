const bookMemberService = require("./bookMemberService");

/**
 * Get books a user is a member of by the said user's ids
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {number} page - Current page number
 * @param {number} limit - Number of users per page
 * @param {string} order - Sort order
 * @returns {Promise<{
 *  skip: number,
 *  limit: number,
 *  total: number,
 *  books: Array<Book> <- includes "role" field
 * }>}
 */
async function getBooksUserCanAccess(userId, page, limit, order) {
  const { memberships, ...rest } =
    await bookMemberService.getBookMembershipsByUserId(
      userId,
      page,
      limit,
      order
    );

  const books = memberships.map((membership) => {
    const m = membership.toObject();
    return {
      role: m.role,
      ...m.book,
    };
  });

  return { books, ...rest };
}

module.exports = {
  getBooksUserCanAccess,
};
