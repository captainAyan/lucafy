const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const {
  createSchema,
  editSchema,
} = require("../../../utilities/validation/book/core/ledgerGroupSchema");
const ledgerGroupService = require("../../../services/book/core/ledgerGroupService");

async function createLedgerGroup(req, res) {
  const { value: ledgerGroupValues, error } = createSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const { ledgerGroup } = await ledgerGroupService.createLedgerGroup(
    req.book.id,
    ledgerGroupValues
  );

  res.status(StatusCodes.CREATED).json(ledgerGroup);
}

async function getLedgerGroupById(req, res) {
  try {
    const group = await ledgerGroupService.getLedgerGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "LedgerGroup not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllLedgerGroups(req, res) {
  try {
    const groups = await ledgerGroupService.getAllLedgerGroups();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function editLedgerGroup(req, res) {
  try {
    const { error, value } = ledgerGroupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const updated = await ledgerGroupService.updateLedgerGroup(
      req.params.id,
      value
    );
    if (!updated)
      return res.status(404).json({ error: "LedgerGroup not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createLedgerGroup,
  getLedgerGroupById,
  getAllLedgerGroups,
  editLedgerGroup,
};
