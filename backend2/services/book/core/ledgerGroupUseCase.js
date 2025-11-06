const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

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
  const updatedLedgerGroup = { _id: originalLedgerGroup._id };

  // update name and description
  updatedLedgerGroup.name = updateData.name;
  updatedLedgerGroup.description = updateData.description;

  const oldParentId = originalLedgerGroup.parent?._id?.toString() || "";
  const newParentId = updateData.parentId;

  console.log("old parent id", oldParentId);
  console.log("new parent id", newParentId);
  console.log("comparison", oldParentId === newParentId);

  // complicated changes (parent change or nature change)
  if (
    oldParentId !== newParentId ||
    originalLedgerGroup.nature !== updateData.nature
  ) {
    const descendants = await ledgerGroupService.getDescendants(
      bookId,
      id,
      LEDGER_GROUP_HIERARCHY_MAX_DEPTH
    );

    // parent changed checks
    if (oldParentId !== newParentId) {
      // new parent assigned
      if (newParentId !== "") {
        // Circular parenting check
        if (
          descendants.some((descendant) => descendant._id.equals(newParentId))
        ) {
          throw createHttpError(
            StatusCodes.BAD_REQUEST,
            "Circular ledger group hierarchy detected"
          );
        }

        // Check level depth
        const newParent = await getLedgerGroup(bookId, newParentId);
        // const ancestors = await ledgerGroupService.getAncestry(
        //   bookId,
        //   newParentId,
        //   LEDGER_GROUP_HIERARCHY_MAX_DEPTH
        // );
        const { ancestors } = newParent;

        const ancestorDepth = ancestors.length + 1; // ancestors of the parent + parent itself
        const maxDescendantsDepth = getMaxDepthOfDescendants(descendants, id);

        console.log("ancestors", ancestorDepth);
        console.log("descendants", maxDescendantsDepth);

        // Calculate the deepest descendant level after move
        const maxDepthAfterMove = ancestorDepth + maxDescendantsDepth + 1;

        if (maxDepthAfterMove > LEDGER_GROUP_HIERARCHY_MAX_DEPTH) {
          throw createHttpError(
            StatusCodes.BAD_REQUEST,
            `Ledger group hierarchy cannot exceed ${LEDGER_GROUP_HIERARCHY_MAX_DEPTH} levels`
          );
        }

        updatedLedgerGroup.parent = newParentId;
        updatedLedgerGroup.nature = newParent.nature;
      }
      // ledger-group turned into a primary ledger-group
      else {
        updatedLedgerGroup.parent = null;
        updatedLedgerGroup.nature = updateData.nature;
      }
    }
    // only nature changed
    else if (originalLedgerGroup.nature !== updateData.nature) {
      updatedLedgerGroup.parent = null;
      updatedLedgerGroup.nature = updateData.nature;
    }

    ///  DO THE COMPLEX UPDATE HERE
    // test response
    console.log("ALL CLEAR");
    return { message: "test all clear" };
  }
  // simple edit just save the update
  return ledgerGroupService.editLedgerGroup(bookId, id, updatedLedgerGroup);

  // Save updates
  // await ledgerGroupService.updateLedgerGroup(bookId, id, updatedLedgerGroup);

  // Optionally: propagate nature/level changes to children
  // await updateChildrenNatureAndLevels(id);

  // return updatedLedgerGroup;
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
