const express = require("express");

const router = express.Router();
const {
  createEntry,
  getEntry,
  getEntries,
  editEntry,
  normalizeEntries,
  normalizeEntry,
  searchEntryByNarration,
} = require("../../controllers/entryController");
const { protect } = require("../../middlewares/authMiddleware");

router.post("/", protect, createEntry);
router.get("/", protect, getEntries);
router.get("/search", protect, searchEntryByNarration);
router.get("/:id", protect, getEntry);
router.put("/normalize", protect, normalizeEntries);
router.put("/:id", protect, editEntry);
router.put("/normalize/:id", protect, normalizeEntry);

module.exports = router;
