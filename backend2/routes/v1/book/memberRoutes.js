const express = require("express");

const router = express.Router();

const {
  getMembers,
  getMemberById,
  addMember,
  editMember,
} = require("../../../controllers/bookMemberController");

router.post("/", addMember);
router.get("/", getMembers);
router.get("/[:memberId]", getMemberById);
router.put("/[:memberId]", editMember);

module.exports = router;
