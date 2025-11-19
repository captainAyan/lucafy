const {
  getLedgerGroupByBookIdAndLedgerGroupId,
} = require("./ledgerGroupService");
const ledgerService = require("./ledgerService");

async function createLedger(bookId, ledgerData) {
  const { ledgerGroupId } = ledgerData;
  const ledgerGroup = await getLedgerGroupByBookIdAndLedgerGroupId(
    bookId,
    ledgerGroupId
  );

  const createdLedger = await ledgerService.createLedger(bookId, ledgerData);
  return createdLedger;
}

async function editLedger(id, bookId, ledgerData) {
  const { ledgerGroupId } = ledgerData;

  const ledgerGroup = await getLedgerGroupByBookIdAndLedgerGroupId(
    bookId,
    ledgerGroupId
  );

  const editedLedger = await ledgerService.editLedger(bookId, id, {
    ledgerGroup: ledgerGroupId,
    ...ledgerData,
  });

  return editedLedger;
}

module.exports = { createLedger, editLedger };
