const express = require("express");

const router = express.Router();
const {
  getProfile,
  editProfile,
  deleteProfile,
} = require("../../controllers/userController");

router.get("/", getProfile);
router.put("/", editProfile);
router.delete("/", deleteProfile);

module.exports = router;
