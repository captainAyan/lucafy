const Ledger = require("../../../models/ledgerModel");

async function createLedger(ledgerData, bookId, creatorId) {
  // TODO ledgers shouldn't have a TYPE field, it should be inherited from the ledgerGroup
  const l = await Ledger.create({
    ...ledgerData,
    book: bookId,
    creator: creatorId,
  });
}

module.exports = {
  createLedger,
};
