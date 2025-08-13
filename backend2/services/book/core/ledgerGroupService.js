const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const LedgerGroup = require("../../../models/ledgerGroupModel");

/**
 * @typedef {import('../../constants/typedefs').LedgerGroup} LedgerGroup
 */

/**
 * Creates a new Ledger Group in the database.
 *
 * @param {String} bookId - MongoDB ObjectId of the book
 * @param {Object} ledgerGroupData - The data for the new ledger.
 * @returns {Promise<LedgerGroup>} - The created Ledger Group document.
 */
async function createLedgerGroup(bookId, { parentId, ...data }) {
  const ledgerGroup = await new LedgerGroup({
    parent: parentId || null,
    book: bookId,
    ...data,
  }).save();
  return ledgerGroup;
}

/**
 * Retrieves a Ledger Group document by its MongoDB ObjectId.
 *
 * @param {string} ledgerGroupId - The MongoDB ObjectId of the ledger group to retrieve.
 * @returns {Promise<LedgerGroup>} - The Ledger Group document if found, otherwise null.
 */
const getLedgerGroupById = async (id) => {
  const ledgerGroup = await LedgerGroup.findById(id)
    .populate("parent")
    .populate("book");

  if (!ledgerGroup)
    throw createHttpError(StatusCodes.NOT_FOUND, "Ledger group not found");

  return ledgerGroup;
};

const getAllLedgerGroups = async () =>
  LedgerGroup.find().populate("parent").populate("book");

const updateLedgerGroup = async (id, data) => {
  return await LedgerGroup.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  createLedgerGroup,
  getLedgerGroupById,
  getAllLedgerGroups,
  updateLedgerGroup,
};
