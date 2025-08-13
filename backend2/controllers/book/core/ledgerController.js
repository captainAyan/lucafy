const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const {
  createSchema,
  editSchema,
} = require("../../../utilities/validation/ledgerSchema");
const ledgerService = require("../../../services/book/core/ledgerService");

async function getLedgers(req, res) {
  res.send("get ledgers");
}

async function getAllLedgers(req, res) {
  res.send("get all ledgers");
}

async function getLedgerById(req, res) {
  res.send("get ledger by id");
}

async function createLedger(req, res) {
  const { value: ledgerValues, error } = createSchema.validate();
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }
  // TODO check if the user is even allowed to create more ledgers.

  const ledger = await ledgerService.createLedger(
    ledgerValues,
    req.book.id,
    req.user.id
  );

  res.send("create ledger");
}

async function editLedger(req, res) {
  res.send("edit ledger");
}

module.exports = {
  createLedger,
  getLedgers,
  getAllLedgers,
  getLedgerById,
  editLedger,
};
