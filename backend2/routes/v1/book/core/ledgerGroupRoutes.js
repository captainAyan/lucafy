const express = require("express");

const router = express.Router();
const {
  createLedgerGroup,
  getLedgerGroups,
  getLedgerGroupById,
  getAllLedgerGroups,
  editLedgerGroup,
} = require("../../../../controllers/book/core/ledgerGroupController");

router.post("/", createLedgerGroup);
router.get("/", getLedgerGroups);
router.get("/all", getAllLedgerGroups);
router.get("/:ledgerGroupId", getLedgerGroupById);
router.put("/:ledgerGroupId", editLedgerGroup);

module.exports = router;
