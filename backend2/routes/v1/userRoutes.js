const express = require("express");

const router = express.Router();
const { getUsers, getUserById } = require("../../controllers/userController");

router.get("/", getUsers);
router.get("/:userId", getUserById);

module.exports = router;
