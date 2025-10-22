const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

const ledgerGroupService = require("./ledgerGroupService");
const {
  LEDGER_GROUP_HIERARCHY_MAX_DEPTH,
} = require("../../../constants/policies");

async function createLedgerGroup(bookId, ledgerGroupData) {
  const { parentId, nature } = ledgerGroupData;
  const updatedLedgerGroupData = { ...ledgerGroupData };

  // checking parent of non-premitive ledger group
  if (parentId) {
    // checking if parent exists in the book
    let parent;
    try {
      const p = await ledgerGroupService.getLedgerGroupByBookIdAndLedgerGroupId(
        bookId,
        parentId
      ); // throws 404
      const ancestors = await ledgerGroupService.getAncestry(
        bookId,
        parentId,
        LEDGER_GROUP_HIERARCHY_MAX_DEPTH
      );
      parent = { ...p.toObject(), ancestors };
    } catch (err) {
      if (err.status === StatusCodes.NOT_FOUND) {
        throw createHttpError(
          StatusCodes.NOT_FOUND,
          "Parent ledger group not found"
        );
      } else throw err;
    }

    const { ancestors } = parent;

    // Hierarchy depth check
    if (ancestors.length === LEDGER_GROUP_HIERARCHY_MAX_DEPTH - 1) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `Ledger group hierarchy cannot exceed ${LEDGER_GROUP_HIERARCHY_MAX_DEPTH} levels`
      );
    }

    // adding derived nature
    if (!nature) {
      updatedLedgerGroupData.nature = parent.nature;
    }
  }

  const newLedgerGroup = await ledgerGroupService.createLedgerGroup(
    bookId,
    updatedLedgerGroupData
  );

  /// ancestors of the created ledger group
  const ancestors = await ledgerGroupService.getAncestry(
    bookId,
    newLedgerGroup.id,
    LEDGER_GROUP_HIERARCHY_MAX_DEPTH
  );

  return {
    ...newLedgerGroup.toObject(),
    ancestors,
  };
}

async function editLedgerGroup(id, bookId, updateData) {
  const existingLedgerGroup = await ledgerGroupService.getLedgerGroupById(
    id,
    bookId
  );
  if (!existingLedgerGroup) {
    throw createHttpError(StatusCodes.NOT_FOUND, "Ledger group not found");
  }

  const { parentId } = updateData;

  if (parentId && !parentId.equals(existingLedgerGroup.parentId)) {
    const result = await ledgerGroupService.getAncestorChain(
      bookId,
      parentId,
      LEDGER_GROUP_HIERARCHY_MAX_DEPTH
    );

    if (!result) {
      throw createHttpError(
        StatusCodes.NOT_FOUND,
        "Parent ledger group not found"
      );
    }

    const { ancestorCount, ancestorIds } = result;

    // Hierarchy depth check
    if (ancestorCount === LEDGER_GROUP_HIERARCHY_MAX_DEPTH - 1) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        `Ledger group hierarchy cannot exceed ${LEDGER_GROUP_HIERARCHY_MAX_DEPTH} levels`
      );
    }

    // cycle check
    if (ancestorIds.some((_id) => _id.equals(parentId))) {
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "Circular ledger group hierarchy detected"
      );
    }
  }

  const updatedLedgerGroup = await ledgerGroupService.editLedgerGroup(
    id,
    bookId,
    updateData
  );

  return updatedLedgerGroup;
}

module.exports = { createLedgerGroup, editLedgerGroup };
