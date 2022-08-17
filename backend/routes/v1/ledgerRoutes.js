const express = require("express");

const router = express.Router();
const {
  createLedger,
  getLedger,
  getLedgers,
  getAllLedgers,
  editLedger,
} = require("../../controllers/ledgerController");
const { protect } = require("../../middleware/authMiddleware");

router.post("/", protect, createLedger);
router.get("/", protect, getLedgers);
router.get("/all", protect, getAllLedgers);
router.get("/:id", protect, getLedger);
router.put("/:id", protect, editLedger);

module.exports = router;
