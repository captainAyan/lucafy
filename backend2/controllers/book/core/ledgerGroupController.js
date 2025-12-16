const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const {
  createSchema,
  editSchema,
} = require("../../../utilities/validation/book/core/ledgerGroupSchema");
const ledgerGroupUseCase = require("../../../services/book/core/ledgerGroup/ledgerGroupUseCase");
const {
  paginationQueryParamSchemaWithKeywordAndLedgerGroupId,
} = require("../../../utilities/validation/paginationQueryParamSchema");

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
  const group = await ledgerGroupUseCase.getLedgerGroup(
    req.book.id,
    req.params.ledgerGroupId
  );
  res.status(StatusCodes.OK).json(group);
}

async function getAllLedgerGroups(req, res) {
  try {
    const groups = await ledgerGroupService.getAllLedgerGroups();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLedgerGroups(req, res) {
  const {
    value: { page, limit, order, keyword, ledgerGroupId },
    error,
  } = paginationQueryParamSchemaWithKeywordAndLedgerGroupId.validate(req.query);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const ledgerGroups = await ledgerGroupUseCase.getLedgerGroups(
    req.book.id,
    page,
    limit,
    order,
    keyword,
    ledgerGroupId
  );

  res.status(StatusCodes.OK).json(ledgerGroups);
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
  getLedgerGroups,
  editLedgerGroup,
};
