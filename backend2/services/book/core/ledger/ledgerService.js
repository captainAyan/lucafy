const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");
const {
  Types: { ObjectId },
} = require("mongoose");

const Ledger = require("../../../../models/ledgerModel");

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
 * Retrives an array of ledger documents by their MongoDB ObjectIDs
 *
 * @param {string} bookId - The MongoDB ObjectId of the book
 * @param {Array<string>} ledgerIds - array of ledger ids
 * @returns {Array<Ledger>} - The array of Ledger documents
 */
async function getLedgersByBookIdAndLedgerIds(bookId, ledgerIds) {
  const ledgerObjectIds = ledgerIds.map(
    (id) => new ObjectId.createFromHexString(id)
  );

  const ledgers = await Ledger.find({
    _id: { $in: ledgerObjectIds },
    book: bookId,
  });

  return ledgers;
}

/**
 * Retrieves paginated list of Ledgers of a book by it's book id
 *
 * @param {string} bookId - MongoDB ObjectId of the book
 * @param {number} page - Current page number
 * @param {number} limit - Number of ledgers per page
 * @param {string} order - Sort order
 * @param {string} [keyword] - search keyword to filter ledgers
 * @param {Array[string]} [ledgerGroupIds] - ledgerGroupIds for filtering (only ledgers with these ledger groups will be returned)
 * @returns {Promise<{
 *  skip: number,
 *  limit: number,
 *  total: number,
 *  ledgers: Array<Ledger>
 * }>}
 */
async function getLedgersByBookId(
  bookId,
  page,
  limit,
  order,
  keyword,
  ledgerGroupIds
) {
  const sortOrder = order === "oldest" ? "createdAt" : "-createdAt";

  const query = {};

  if (keyword && keyword.trim() !== "") {
    const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    query.$or = [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
    ];
  }
  query.book = bookId;

  if (Array.isArray(ledgerGroupIds) && ledgerGroupIds.length > 0)
    query.ledgerGroup = { $in: ledgerGroupIds };

  const total = await Ledger.countDocuments(query);

  const ledgers = await Ledger.find(query)
    .sort(sortOrder)
    .skip(page * limit)
    .limit(limit)
    .populate("ledgerGroup");

  return { skip: page * limit, limit, total, ledgers };
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
  getLedgersByBookIdAndLedgerIds,
  getLedgersByBookId,
  createLedger,
  editLedger,
};
