const bookMemberService = require("./bookMemberService");

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
