const express = require("express");

const router = express.Router();
const {
  createLedgerGroup,
  getLedgerGroupById,
  getAllLedgerGroups,
  editLedgerGroup,
} = require("../../../../controllers/book/core/ledgerGroupController");

router.post("/", createLedgerGroup);
router.get("/all", getAllLedgerGroups);
router.get("/:ledgerGroupId", getLedgerGroupById);
router.put("/:ledgerGroupId", editLedgerGroup);

module.exports = router;
