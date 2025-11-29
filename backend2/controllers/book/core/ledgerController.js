const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const {
  createSchema,
  editSchema,
} = require("../../../utilities/validation/book/core/ledgerSchema");
const ledgerService = require("../../../services/book/core/ledgerService");
const ledgerUseCase = require("../../../services/book/core/ledgerUseCase");
const {
  paginationQueryParamSchemaForLedgers,
} = require("../../../utilities/validation/paginationQueryParamSchema");

async function getLedgers(req, res) {
  const {
    value: { page, limit, order, keyword, ledgerGroupId },
    error,
  } = paginationQueryParamSchemaForLedgers.validate(req.query);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid query parameter");
  }

  const ledgers = await ledgerUseCase.getLedgers(
    req.book.id,
    page,
    limit,
    order,
    keyword,
    ledgerGroupId
  );

  res.status(StatusCodes.OK).json(ledgers);
}

async function getAllLedgers(req, res) {
  res.send("get all ledgers");
}

async function getLedgerById(req, res) {
  const ledger = await ledgerService.getLedgerByBookIdAndLedgerId(
    req.book.id,
    req.params.ledgerId
  );
  res.status(StatusCodes.OK).json(ledger);
}

async function createLedger(req, res) {
  const { value: ledgerValues, error } = createSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const ledger = await ledgerUseCase.createLedger(req.book.id, ledgerValues);

  res.status(StatusCodes.CREATED).json(ledger);
}

async function editLedger(req, res) {
  const { value: ledgerValues, error } = editSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const ledger = await ledgerUseCase.editLedger(
    req.params.ledgerId,
    req.book.id,
    ledgerValues
  );

  res.status(StatusCodes.OK).json(ledger);
}

module.exports = {
  createLedger,
  getLedgers,
  getAllLedgers,
  getLedgerById,
  editLedger,
};
