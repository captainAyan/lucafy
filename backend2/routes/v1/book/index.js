const express = require("express");

const bookPermissionMiddleware = require("../../../middlewares/bookPermissionMiddleware");

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
router.get("/:bookId", bookPermissionMiddleware, getBookById);
router.put("/:bookId", bookPermissionMiddleware, editBook);
router.delete("/:bookId", bookPermissionMiddleware, deleteBook);

// router.use("/member", require("./memberRoutes"));
// router.use("/core", require("./core/index"));

module.exports = router;
