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
} = require("../../../../controllers/book/core/entryController");

router.post("/", createEntry);
router.get("/", getEntries);
router.get("/search", searchEntryByNarration);
router.get("/:entryId", getEntry);
router.put("/normalize", normalizeEntries);
router.put("/:entryId", editEntry);
router.put("/normalize/:entryId", normalizeEntry);

module.exports = router;
