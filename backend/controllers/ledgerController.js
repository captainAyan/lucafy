const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const Ledger = require("../models/ledgerModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");
const { createSchema, editSchema } = require("../util/ledgerValidationSchema");
const {
  REGULAR_TIER_LEDGER_LIMIT,
  PAGINATION_LIMIT,
} = require("../constants/policies");

const getLedgers = asyncHandler(async (req, res, next) => {
  const PAGE = req.query.page || 0;

  try {
    const ledgers = await Ledger.find({ user_id: req.user.id })
      .sort("-created_at")
      .select("-user_id")
      .skip(PAGE * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT);

    const response = {
      skip: PAGE * PAGINATION_LIMIT,
      limit: LIMIT,
      total: await Ledger.find({ user_id: req.user.id }).count(),
      ledgers,
    };

    res.status(StatusCodes.OK).json(response);
  } catch {
    throw new ErrorResponse("Unknown error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

const createLedger = asyncHandler(async (req, res, next) => {
  const { error } = createSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const totalLedgers = await Ledger.find({ user_id: req.user.id }).count();

  if (totalLedgers == REGULAR_TIER_LEDGER_LIMIT) {
    throw new ErrorResponse("Ledger limit reached", StatusCodes.FORBIDDEN);
  }

  try {
    const ledger = Ledger.create({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(StatusCodes.CREATED).json(ledger);
  } catch (error1) {
    throw new ErrorResponse("Unknown error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = {
  createLedger,
  getLedgers,
};
