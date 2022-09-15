const express = require("express");

const router = express.Router();
const {
  viewLedgerStatement,
  viewTrialBalance,
  viewMicroStatement,
  viewCalendarHeatmap,
  exportJournalStatement,
} = require("../../controllers/statementController");
const { protect } = require("../../middleware/authMiddleware");

router.get("/ledger/:id", protect, viewLedgerStatement);
router.get("/trial-balance", protect, viewTrialBalance);
router.get("/micro-statement", protect, viewMicroStatement);
router.get("/calendar-heatmap", protect, viewCalendarHeatmap);
router.get("/export", protect, exportJournalStatement);

module.exports = router;
