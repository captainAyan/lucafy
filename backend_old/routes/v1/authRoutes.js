const express = require("express");

const router = express.Router();
const {
  login,
  register,
  changePassword,
} = require("../../controllers/userController");
const { protect } = require("../../middlewares/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.put("/changepassword", protect, changePassword);

module.exports = router;
