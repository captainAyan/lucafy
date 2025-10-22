const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const {
  Types: { ObjectId },
} = require("mongoose");

const LedgerGroup = require("../../../models/ledgerGroupModel");

/**
 * @typedef {import('../../constants/typedefs').LedgerGroup} LedgerGroup
 */

/**
 * Retrieves a Ledger Group document by its MongoDB ObjectId.
 *
 * @param {string} bookId - The MongoDB ObjectId of the book
 * @param {string} ledgerGroupId - The MongoDB ObjectId of the ledger group to retrieve.
 * @returns {Promise<LedgerGroup>} - The Ledger Group document if found, otherwise null.
 */
async function getLedgerGroupByBookIdAndLedgerGroupId(bookId, ledgerGroupId) {
  const ledgerGroup = await LedgerGroup.findOne({
    _id: ledgerGroupId,
    book: bookId,
  }).populate("parent");

  if (!ledgerGroup) {
    throw createHttpError(StatusCodes.NOT_FOUND, "Ledger group not found");
  }

  return ledgerGroup;
}

/**
 * Creates a new Ledger Group in the database.
 *
 * @param {String} bookId - MongoDB ObjectId of the book
 * @param {Object} ledgerGroupData - The data for the new ledger.
 * @returns {Promise<LedgerGroup>} - The created Ledger Group document.
 */
async function createLedgerGroup(bookId, { parentId, ...data }) {
  try {
    const ledgerGroup = await new LedgerGroup({
      parent: parentId || null,
      book: bookId,
      ...data,
    }).save();

    return await getLedgerGroupByBookIdAndLedgerGroupId(bookId, ledgerGroup.id);
  } catch (err) {
    if (err.code === 11000) {
      throw createHttpError(
        StatusCodes.FORBIDDEN,
        "Ledger group with same name already exists"
      );
    }
    throw err;
  }
}

const getAllLedgerGroups = async () =>
  LedgerGroup.find().populate("parent").populate("book");

async function editLedgerGroup(id, bookId, ledgerGroupData) {
  const ledgerGroup = await getLedgerGroupByBookIdAndLedgerGroupId(bookId, id);

  const { parentId, data } = {
    parent: ledgerGroupData.parentId || null,
    ...ledgerGroupData,
  };

  console.log(data);

  Object.assign(ledgerGroup, data);

  return await LedgerGroup.findByIdAndUpdate(ledgerGroup.id, ledgerGroup, {
    new: true,
    runValidators: true,
  }).populate("parent");
}

/**
 * Retrieves the ancestor chain of a ledger group using MongoDB's $graphLookup.
 *
 * @param {string} bookId - The ID of the book the ledger group belongs to.
 * @param {string} id - The ID of the ledger group.
 * @param {number} maxDepth - Number of ancestors to look for
 * @returns {Promise<Array<LedgerGroup>>} - an array of all the ledger group ancestors
 */
async function getAncestry(bookId, id, maxDepth) {
  const result = await LedgerGroup.aggregate([
    { $match: { _id: new ObjectId(id), book: new ObjectId(bookId) } },
    {
      $graphLookup: {
        from: "ledgergroups",
        startWith: "$parent",
        connectFromField: "parent",
        connectToField: "_id",
        as: "ancestors",
        maxDepth,
      },
    },
    { $project: { ancestors: 1, _id: 0 } },
  ]);

  if (result && result[0] && result[0].ancestors) {
    const [{ ancestors }] = result; // ancestors = result[0].ancestors
    const updatedAncestors = ancestors.map((ancestor) => ({
      ...ancestor,
      id: ancestor._id,
    }));

    return updatedAncestors;
  }
  return null;
}

module.exports = {
  createLedgerGroup,
  getLedgerGroupByBookIdAndLedgerGroupId,
  getAllLedgerGroups,
  editLedgerGroup,
  getAncestry,
};
