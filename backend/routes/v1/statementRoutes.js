const express = require("express");

const router = express.Router();
const {
  viewLedgerStatement,
  viewTrialBalance,
  viewMicroStatement,
  viewCalendarHeatmap,
} = require("../../controllers/statementController");
const { protect } = require("../../middleware/authMiddleware");

router.get("/ledger/:id", protect, viewLedgerStatement);
router.get("/trial-balance", protect, viewTrialBalance);
router.get("/micro-statement", protect, viewMicroStatement);
router.get("/calendar-heatmap", protect, viewCalendarHeatmap);

module.exports = router;
