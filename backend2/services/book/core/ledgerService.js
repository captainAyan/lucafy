const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const Ledger = require("../../../models/ledgerModel");

/**
 * @typedef {import('../../constants/typedefs').Ledger} Ledger
 */

/**
 * Retrieves a Ledger document by its MongoDB ObjectId.
 *
 * @param {string} bookId - The MongoDB ObjectId of the book
 * @param {string} ledgerId - The MongoDB ObjectId of the ledger to retrieve.
 * @returns {Promise<Ledger>} - The Ledger document if found, otherwise null.
 */
async function getLedgerByBookIdAndLedgerId(bookId, ledgerId, session = null) {
  const ledger = await Ledger.findOne({
    _id: ledgerId,
    book: bookId,
  })
    .session(session || undefined)
    .populate("ledgerGroup");

  if (!ledger) {
    throw createHttpError(StatusCodes.NOT_FOUND, "Ledger not found");
  }

  return ledger;
}

/**
 * Creates a new Ledger in the database.
 *
 * @param {String} bookId - MongoDB ObjectId of the book
 * @param {Object} ledgerData - The data for the new ledger.
 * @returns {Promise<LedgerGroup>} - The created Ledger document.
 */
async function createLedger(bookId, { ledgerGroupId, ...data }) {
  try {
    const ledger = await new Ledger({
      ledgerGroup: ledgerGroupId,
      book: bookId,
      ...data,
    }).save();

    return await getLedgerByBookIdAndLedgerId(bookId, ledger.id);
  } catch (err) {
    if (err.code === 11000) {
      throw createHttpError(
        StatusCodes.FORBIDDEN,
        "Ledger with same name already exists"
      );
    }
    throw err;
  }
}

async function editLedger(bookId, id, ledgerData, session = null) {
  const ledger = await getLedgerByBookIdAndLedgerId(bookId, id, session);

  Object.assign(ledger, ledgerData);

  try {
    const update = await Ledger.findByIdAndUpdate(ledger.id, ledger, {
      new: true,
      runValidators: true,
      session,
    }).populate("ledgerGroup");

    return update;
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

module.exports = {
  getLedgerByBookIdAndLedgerId,
  createLedger,
  editLedger,
};
