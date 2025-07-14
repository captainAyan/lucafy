const bookMemberService = require("./bookMemberService");

async function getBooksUserCanAccess(userId) {
  const memberships =
    await bookMemberService.getBookMembershipsByUserId(userId);

  const books = memberships.map((membership) => {
    const m = membership.toObject();
    return {
      role: m.role,
      ...m.book,
    };
  });

  return books;
}

module.exports = {
  getBooksUserCanAccess,
};
