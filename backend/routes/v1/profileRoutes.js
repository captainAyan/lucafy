const express = require("express");

const router = express.Router();
const {
  getProfile,
  editProfile,
  deleteProfile,
} = require("../../controllers/userController");
const { protect } = require("../../middleware/authMiddleware");

router.get("/", protect, getProfile);
router.put("/", protect, editProfile);
router.delete("/", protect, deleteProfile);

module.exports = router;
