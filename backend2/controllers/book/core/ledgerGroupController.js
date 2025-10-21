const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const {
  createSchema,
  editSchema,
} = require("../../../utilities/validation/book/core/ledgerGroupSchema");
const ledgerGroupUseCase = require("../../../services/book/core/ledgerGroupUseCase");

async function createLedgerGroup(req, res) {
  const { value: ledgerGroupValues, error } = createSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const ledgerGroup = await ledgerGroupUseCase.createLedgerGroup(
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
  const { value: ledgerGroupValues, error } = editSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const ledgerGroup = await ledgerGroupUseCase.editLedgerGroup(
    req.params.ledgerGroupId,
    req.book.id,
    ledgerGroupValues
  );

  res.status(StatusCodes.OK).json(ledgerGroup);
}

module.exports = {
  createLedgerGroup,
  getLedgerGroupById,
  getAllLedgerGroups,
  editLedgerGroup,
};
