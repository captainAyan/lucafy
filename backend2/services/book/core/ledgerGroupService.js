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
async function getLedgerGroupByBookIdAndLedgerGroupId(
  bookId,
  ledgerGroupId,
  session = null
) {
  const ledgerGroup = await LedgerGroup.findOne({
    _id: ledgerGroupId,
    book: bookId,
  })
    .session(session || undefined)
    .populate("parent");

  if (!ledgerGroup) {
    throw createHttpError(StatusCodes.NOT_FOUND, "Ledger group not found");
  }

  return ledgerGroup;
}

async function getLedgerGroups(bookId, page, limit, order, keyword) {
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

  const total = await LedgerGroup.countDocuments(query);

  const ledgerGroups = await LedgerGroup.find(query)
    .sort(sortOrder)
    .skip(page * limit)
    .limit(limit);

  return { skip: page * limit, limit, total, ledgerGroups };
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

const getAllLedgerGroups = async () => LedgerGroup.find().populate("parent");

async function editLedgerGroup(bookId, id, ledgerGroupData, session = null) {
  const ledgerGroup = await getLedgerGroupByBookIdAndLedgerGroupId(
    bookId,
    id,
    session
  );

  Object.assign(ledgerGroup, ledgerGroupData);

  try {
    const update = await LedgerGroup.findByIdAndUpdate(
      ledgerGroup.id,
      ledgerGroup,
      {
        new: true,
        runValidators: true,
        session,
      }
    ).populate("parent");

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

async function editLedgerGroups(bookId, ids, ledgerGroupData, session = null) {
  const objectIds = ids.map((id) => {
    if (id instanceof ObjectId) return id;
    if (typeof id === "string") return ObjectId.createFromHexString(id);
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid IDs array");
  });

  await LedgerGroup.updateMany(
    { _id: { $in: objectIds }, book: bookId },
    { $set: ledgerGroupData },
    { session, runValidators: true }
  );

  // return updated documents
  return LedgerGroup.find({
    _id: { $in: objectIds },
    book: bookId,
  }).session(session || undefined);
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
    {
      $match: {
        _id: ObjectId.createFromHexString(id),
        book: ObjectId.createFromHexString(bookId),
      },
    },
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

/**
 * Retrieves the descendants chain of a ledger group using MongoDB's $graphLookup.
 *
 * @param {string} bookId - The ID of the book the ledger group belongs to.
 * @param {string} id - The ID of the ledger group.
 * @param {number} maxDepth - Number levels of descendents to look for
 * @param {object} [options] - Pagination options
 * @param {number} [options.page] - Page number
 * @param {number} [options.limit] - Items per page
 * @param {string} [options.order] - 'newest' or 'oldest' (sorted by createdAt)
 *
 * @returns {Promise<{
 *  skip: number,
 *  limit: number,
 *  total: number
 *  ledgerGroups: Array<LedgerGroup>,
 * }>}
 */
async function getDescendants(bookId, id, maxDepth, options = {}) {
  const { page, limit, order } = options;

  const sortOrder = order === "oldest" ? 1 : -1;
  const paginationStages = [];

  if (order && page && limit) {
    const skip = page * limit;
    paginationStages.push({ $skip: skip });
    paginationStages.push({ $limit: limit });
    paginationStages.push({ $sort: { "descendants.createdAt": sortOrder } });
  }

  // main aggregation
  const pipeline = [
    {
      $match: {
        _id: ObjectId.createFromHexString(id),
        book: ObjectId.createFromHexString(bookId),
      },
    },
    {
      $graphLookup: {
        from: "ledgergroups",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parent",
        as: "descendants",
        maxDepth,
      },
    },
  ];

  // If NO pagination or sorting — fallback to old behavior
  const paginationRequested = paginationStages.length > 0;

  if (!paginationRequested) {
    pipeline.push({ $project: { descendants: 1, _id: 0 } });

    const result = await LedgerGroup.aggregate(pipeline);

    if (result && result[0] && result[0].descendants) {
      const [{ descendants }] = result;

      const updated = descendants.map((d) => ({
        ...d,
        id: d._id,
      }));

      return {
        ledgerGroups: updated,
        total: descendants.length,
        skip: 0,
        limit: 0,
      };
    }

    return { ledgerGroups: [], total: 0, skip: 0, limit: 0 };
  }

  // If pagination IS requested — apply facet pipeline
  pipeline.push(
    { $unwind: "$descendants" },
    {
      $facet: {
        data: [
          ...paginationStages,
          {
            $group: {
              _id: null,
              descendants: { $push: "$descendants" },
            },
          },
          { $project: { _id: 0, descendants: 1 } },
        ],
        total: [{ $count: "count" }],
      },
    }
  );

  const result = await LedgerGroup.aggregate(pipeline);

  const dataBlock = result[0]?.data?.[0] || { descendants: [] };
  const totalCount = result[0]?.total?.[0]?.count || 0;

  const updatedDescendants = dataBlock.descendants.map((d) => ({
    ...d,
    id: d._id,
  }));

  return {
    ledgerGroups: updatedDescendants,
    skip: page * limit,
    limit,
    total: totalCount,
  };
}

module.exports = {
  createLedgerGroup,
  getLedgerGroupByBookIdAndLedgerGroupId,
  getLedgerGroups,
  getAllLedgerGroups,
  editLedgerGroup,
  editLedgerGroups,
  getAncestry,
  getDescendants,
};
