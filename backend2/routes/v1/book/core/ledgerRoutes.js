const express = require("express");

const router = express.Router();
const {
  createLedger,
  getLedgerById,
  getLedgers,
  getAllLedgers,
  editLedger,
} = require("../../../../controllers/book/core/ledgerController");

router.post("/", createLedger);
router.get("/", getLedgers);
router.get("/all", getAllLedgers);
router.get("/:ledgerId", getLedgerById);
router.put("/:ledgerId", editLedger);

module.exports = router;
