const express = require("express");

const router = express.Router();

const {
  authorizeRole,
} = require("../../../middlewares/bookMembershipMiddleware");
const { ADMIN, MEMBER } =
  require("../../../constants/policies").BOOK_MEMBER_ROLE;
const {
  createBookMember,
  getBookMembers,
  getBookMemberById,
  editBookMember,
  deleteBookMember,
} = require("../../../controllers/book/bookMemberController");

router.get("/", authorizeRole([ADMIN, MEMBER]), getBookMembers);

router.post("/", authorizeRole([ADMIN]), createBookMember);
router.get("/:memberId", authorizeRole([ADMIN]), getBookMemberById);
router.put("/:memberId", authorizeRole([ADMIN]), editBookMember);
router.delete("/:memberId", authorizeRole([ADMIN]), deleteBookMember);

module.exports = router;
