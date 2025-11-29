const {
  getLedgerGroupByBookIdAndLedgerGroupId,
} = require("./ledgerGroupService");
const ledgerService = require("./ledgerService");
const ledgerGroupService = require("./ledgerGroupService");
const {
  LEDGER_GROUP_HIERARCHY_MAX_DEPTH,
} = require("../../../constants/policies");

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

async function getLedgers(bookId, page, limit, order, keyword, ledgerGroupId) {
  if (ledgerGroupId && ledgerGroupId !== "") {
    const mainLedgerGroup =
      await ledgerGroupService.getLedgerGroupByBookIdAndLedgerGroupId(
        bookId,
        ledgerGroupId
      );

    const descendants = await ledgerGroupService.getDescendants(
      bookId,
      ledgerGroupId,
      LEDGER_GROUP_HIERARCHY_MAX_DEPTH
    );

    const ledgerGroupIds = [
      ...descendants.map((d) => d._id.toString()),
      ledgerGroupId,
    ];

    return ledgerService.getLedgersByBookId(
      bookId,
      page,
      limit,
      order,
      keyword,
      ledgerGroupIds
    );
  }
  return ledgerService.getLedgersByBookId(
    bookId,
    page,
    limit,
    order,
    keyword,
    []
  );
}

module.exports = { createLedger, editLedger, getLedgers };
