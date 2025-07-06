const express = require("express");

const getBookPermissionMiddleware = require("../../../middlewares/bookPermissionMiddleware");
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
router.get("/", getBooksByUser); // TODO this one's a bit tricky
router.get(
  "/:bookId",
  getBookPermissionMiddleware([ADMIN, MEMBER]),
  getBookById
);
router.put("/:bookId", getBookPermissionMiddleware([ADMIN]), editBook);
router.delete("/:bookId", getBookPermissionMiddleware([ADMIN]), deleteBook);

// router.use("/member", require("./memberRoutes"));
// router.use("/core", require("./core/index"));

module.exports = router;
