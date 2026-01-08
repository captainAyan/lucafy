const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const entryOrchestrator = require("./entryOrchestrator");
const ledgerService = require("../ledger/ledgerService");

async function createEntry(bookId, entryData) {
  // check if the ledgers actually exist
  const ledgerIds = entryData.lines.map((l) => l.ledgerId);
  const ledgers = await ledgerService.getLedgersByBookIdAndLedgerIds(
    bookId,
    ledgerIds
  );
  if (ledgers.length === ledgerIds.length)
    throw createHttpError(
      StatusCodes.NOT_FOUND,
      "Some of the ledgers are not found"
    );

  const createdEntry = entryOrchestrator.createEntry();

  return createdEntry;
}

module.exports = { createEntry };
