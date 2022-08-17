const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const Entry = require("../models/entryModel");
const Ledger = require("../models/ledgerModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");
const { createSchema, editSchema } = require("../util/entryValidationSchema");
const { PAGINATION_LIMIT, ENTRY_LIMIT } = require("../constants/policies");

const getEntries = asyncHandler(async (req, res, next) => {
  const PAGE = parseInt(req.query.page, 10) || 0;

  const entries = await Entry.find({ user_id: req.user.id })
    .sort("-created_at")
    .populate("debit_ledger", "-user_id -balance")
    .populate("credit_ledger", "-user_id -balance")
    .select(["-user_id"])
    .skip(PAGE * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT);

  const response = {
    skip: PAGE * PAGINATION_LIMIT,
    limit: PAGINATION_LIMIT,
    total: await Entry.find({ user_id: req.user.id }).count(),
    entries,
  };

  res.status(StatusCodes.OK).json(response);
});

const getEntry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let entry;

  try {
    entry = await Entry.findOne({ _id: id, user_id: req.user.id })
      .populate("debit_ledger", "-user_id -balance")
      .populate("credit_ledger", "-user_id -balance")
      .select(["-user_id"]);
  } catch (error) {
    // for invalid mongodb objectId
    throw new ErrorResponse("Entry not found", StatusCodes.NOT_FOUND);
  }

  if (!entry) {
    throw new ErrorResponse("Entry not found", StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json(entry);
});

const createEntry = asyncHandler(async (req, res, next) => {
  const { error } = createSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const totalEntries = await Entry.find({ user_id: req.user.id }).count();

  if (totalEntries === ENTRY_LIMIT) {
    throw new ErrorResponse("Entry limit reached", StatusCodes.FORBIDDEN);
  }

  const { debit_ledger_id, credit_ledger_id, amount, narration } = req.body;

  const debit_ledger = await Ledger.findOne({
    user_id: req.user.id,
    _id: debit_ledger_id,
  });

  if (!debit_ledger) {
    throw new ErrorResponse("Invalid debit ledger", StatusCodes.BAD_REQUEST);
  }

  const credit_ledger = await Ledger.findOne({
    user_id: req.user.id,
    _id: credit_ledger_id,
  });

  if (!credit_ledger) {
    throw new ErrorResponse("Invalid credit ledger", StatusCodes.BAD_REQUEST);
  }

  const e = await Entry.create({
    ...req.body,
    debit_ledger: debit_ledger.id,
    credit_ledger: credit_ledger.id,
    user_id: req.user.id,
  });

  const entry = await Entry.findById(e.id)
    .populate("debit_ledger", "-user_id -balance")
    .populate("credit_ledger", "-user_id -balance")
    .select(["-user_id"]);

  res.status(StatusCodes.CREATED).json(entry);
});

const editEntry = asyncHandler(async (req, res, next) => {
  const { error } = editSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const { id } = req.params;

  let entry;

  try {
    entry = await Entry.findOne({ _id: id, user_id: req.user.id })
      .populate("debit_ledger", "-user_id -balance")
      .populate("credit_ledger", "-user_id -balance")
      .select(["-user_id"]);
  } catch (error) {
    // for invalid mongodb objectId
    throw new ErrorResponse("Entry not found", StatusCodes.NOT_FOUND);
  }

  if (!entry) {
    throw new ErrorResponse("Entry not found", StatusCodes.NOT_FOUND);
  }

  const { narration } = req.body;

  entry.narration = narration;

  entry.save();

  res.status(StatusCodes.OK).json(entry);
});

module.exports = {
  createEntry,
  getEntry,
  getEntries,
  editEntry,
};
