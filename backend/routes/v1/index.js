const express = require("express");

const protect = require("../../middlewares/authMiddleware");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/profile", protect, require("./profileRoutes"));
router.use("/user", protect, require("./userRoutes"));
router.use("/book", protect, require("./book/index"));

module.exports = router;
