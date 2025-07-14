const express = require("express");

const {
  addBookAndMembershipData,
  authorizeRole,
} = require("../../../middlewares/bookMembershipMiddleware");
const { ADMIN, MEMBER } =
  require("../../../constants/policies").BOOK_MEMBER_ROLE;

const router = express.Router();

const {
  createBook,
  getBookById,
  editBook,
  deleteBook,
  getBooksByUser,
} = require("../../../controllers/book/bookController");

router.post("/", createBook);
router.get("/", getBooksByUser);

// middleware for req.book and req.membership
router.use("/:bookId", addBookAndMembershipData);

router.get("/:bookId", authorizeRole([ADMIN, MEMBER]), getBookById);
router.put("/:bookId", authorizeRole([ADMIN]), editBook);
router.delete("/:bookId", authorizeRole([ADMIN]), deleteBook);

router.use("/:bookId/member", require("./bookMemberRoutes"));
// router.use("/:bookId/core", require("./core/index"));

module.exports = router;
