import { Router } from "express";

import {
  addBookAndMembershipData,
  authorizeRole,
} from "../../../middlewares/bookMembership.middleware.js";
import { BookMemberRole } from "../../../constants/policies.js";

import {
  createBook,
  getBookById,
  editBook,
  getBooksByUser,
} from "../../../controllers/book/book.controller.js";

const { ADMIN } = BookMemberRole;

const router = Router();

router.post("/", createBook);
router.get("/", getBooksByUser);
router.get("/:bookId", getBookById);

// middleware for req.book and req.membership
router.use("/:bookId", addBookAndMembershipData);

router.put("/:bookId", authorizeRole([ADMIN]), editBook);
// router.delete("/:bookId", authorizeRole([ADMIN]), deleteBook);

// router.use("/:bookId/member", require("./bookMemberRoutes"));
// router.use(
//   "/:bookId/core",
//   authorizeRole([ADMIN, MEMBER]),
//   require("./core/index"),
// );

export default router;
