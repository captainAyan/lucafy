const bookMemberService = require("./bookMemberService");

async function getBooksUserCanAccess(userId) {
  return bookMemberService.getBooksByUser(userId);
}

module.exports = {
  getBooksUserCanAccess,
};
