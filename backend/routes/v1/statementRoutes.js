const express = require("express");

const router = express.Router();
const {
  viewLedgerStatement,
  viewTrialBalance,
} = require("../../controllers/statementController");
const { protect } = require("../../middleware/authMiddleware");

router.get("/ledger/:id", protect, viewLedgerStatement);
router.get("/trial-balance", protect, viewTrialBalance);

module.exports = router;
