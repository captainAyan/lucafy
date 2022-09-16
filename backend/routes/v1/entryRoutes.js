const express = require("express");

const router = express.Router();
const {
  createEntry,
  getEntry,
  getEntries,
  editEntry,
  normalizeEntries,
} = require("../../controllers/entryController");
const { protect } = require("../../middleware/authMiddleware");

router.post("/", protect, createEntry);
router.get("/", protect, getEntries);
router.get("/:id", protect, getEntry);
router.put("/normalize", protect, normalizeEntries);
router.put("/:id", protect, editEntry);

module.exports = router;
