const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { startSession } = require("mongoose");

const ledgerGroupService = require("./ledgerGroupService");
const {
  LEDGER_GROUP_HIERARCHY_MAX_DEPTH,
} = require("../../../constants/policies");

/**
 * @typedef {import('../../constants/typedefs').LedgerGroup} LedgerGroup
 */

/**
 *
 * @param {string} bookId
 * @param {string} ledgerGroupId
 * @returns {<LedgerGroup>} includes ancestors field
 */
async function getLedgerGroup(bookId, ledgerGroupId) {
  const ledgerGroup =
    await ledgerGroupService.getLedgerGroupByBookIdAndLedgerGroupId(
      bookId,
      ledgerGroupId
    );

  const ancestors = await ledgerGroupService.getAncestry(
    bookId,
    ledgerGroupId,
    LEDGER_GROUP_HIERARCHY_MAX_DEPTH
  );

  return { ...ledgerGroup.toObject(), ancestors };
}

async function createLedgerGroup(bookId, ledgerGroupData) {
  const { parentId, nature } = ledgerGroupData;
  const updatedLedgerGroupData = { ...ledgerGroupData };

  // checking parent of non-premitive ledger group
  if (parentId) {
    // checking if parent exists in the book
    let parent;
    try {
      parent = await getLedgerGroup(bookId, parentId); // throws 404
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

  const createdLedgerGroup = await ledgerGroupService.createLedgerGroup(
    bookId,
    updatedLedgerGroupData
  );

  return getLedgerGroup(bookId, createdLedgerGroup.id);
}

async function editLedgerGroup(id, bookId, updateData) {
  const originalLedgerGroup = await getLedgerGroup(bookId, id);

  const updatedLedgerGroup = {
    _id: originalLedgerGroup._id,
    name: updateData.name,
    description: updateData.description,
  };

  const oldParentId = originalLedgerGroup.parent?._id?.toString() || "";
  const newParentId = updateData.parentId;
  const parentChanged = oldParentId !== newParentId;
  const natureChanged = originalLedgerGroup.nature !== updateData.nature;

  console.log("old parent id", oldParentId);
  console.log("new parent id", newParentId);
  console.log("comparison", oldParentId === newParentId);
  console.log("parent changed", parentChanged);
  console.log("nature changed", natureChanged);
  console.log("og nature", originalLedgerGroup.nature);
  console.log("new nature", updateData.nature);

  if (parentChanged || natureChanged) {
    const descendants = await ledgerGroupService.getDescendants(
      bookId,
      id,
      LEDGER_GROUP_HIERARCHY_MAX_DEPTH
    );

    if (parentChanged) {
      if (newParentId) {
        // case 1: new parent

        // Group id and group's parent id is same
        if (originalLedgerGroup._id.toString() === newParentId) {
          throw createHttpError(
            StatusCodes.BAD_REQUEST,
            "Parent ID cannot be same as the ledger group ID"
          );
        }

        // Circular parenting check
        if (descendants.some((d) => d._id.equals(newParentId))) {
          throw createHttpError(
            StatusCodes.BAD_REQUEST,
            "Circular ledger group hierarchy detected"
          );
        }

        // Check level depth
        const newParent = await getLedgerGroup(bookId, newParentId);
        const ancestorDepth = newParent.ancestors.length + 1; // ancestors of the parent + parent itself
        const maxDescendantsDepth = getMaxDepthOfDescendants(descendants, id);

        // Calculate the deepest descendant level after move
        const maxDepthAfterMove = ancestorDepth + maxDescendantsDepth + 1;

        console.log("ancestors", ancestorDepth);
        console.log("descendants", maxDescendantsDepth);

        if (maxDepthAfterMove > LEDGER_GROUP_HIERARCHY_MAX_DEPTH) {
          throw createHttpError(
            StatusCodes.BAD_REQUEST,
            `Ledger group hierarchy cannot exceed ${LEDGER_GROUP_HIERARCHY_MAX_DEPTH} levels`
          );
        }

        updatedLedgerGroup.parent = newParentId;
        updatedLedgerGroup.nature = newParent.nature;
      } else {
        // case 2: remove parent, turned to primary group

        if (updateData.nature === "")
          throw createHttpError(
            StatusCodes.BAD_GATEWAY,
            "Primary ledger group requires nature"
          );

        updatedLedgerGroup.parent = null;
        updatedLedgerGroup.nature = updateData.nature; // updating nature
      }
    } else if (natureChanged) {
      if (originalLedgerGroup.parent)
        // case 4: has a prent, so nature change is not allowed
        throw createHttpError(
          StatusCodes.BAD_REQUEST,
          "Nature of a ledger group cannot be changed directly if it has a parent"
        );

      // case 3: only nature changes and no parent
      updatedLedgerGroup.parent = null;
      updatedLedgerGroup.nature = updateData.nature;
    }

    // do the bulk update

    const session = await startSession();
    session.startTransaction();

    try {
      const result = await ledgerGroupService.editLedgerGroup(
        bookId,
        id,
        updatedLedgerGroup,
        session
      );

      await ledgerGroupService.editLedgerGroups(
        bookId,
        descendants.map((d) => d._id),
        { nature: updatedLedgerGroup.nature },
        session
      );

      await session.commitTransaction();
      session.endSession();

      return result;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
  // simple edit just save the update
  return ledgerGroupService.editLedgerGroup(bookId, id, updatedLedgerGroup);
}

// Helper function
function getMaxDepthOfDescendants(descendants, parentId) {
  // If you store level info in each, this can be simpler
  // Otherwise, estimate depth based on relationships
  // For now, assume flat descendants array:
  // e.g., [{id: 2, parent: 1}, {id: 3, parent: 2}]
  const map = new Map();
  descendants.forEach((d) => map.set(d.id, d.parent));

  function depth(id) {
    let count = 0;
    let currentId = id;
    while (map.has(currentId)) {
      currentId = map.get(currentId);
      count += 1;
    }
    return count;
  }

  return descendants.reduce((acc, d) => Math.max(acc, depth(d.id)), 0);
}

module.exports = { getLedgerGroup, createLedgerGroup, editLedgerGroup };
