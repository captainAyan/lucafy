const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
var mongoose = require("mongoose");

const Entry = require("../models/entryModel");
const Ledger = require("../models/ledgerModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");
const { PAGINATION_LIMIT } = require("../constants/policies");

const viewLedgerStatement = asyncHandler(async (req, res, next) => {
  const { id: ledger_id } = req.params;
  const PAGE = parseInt(req.query.page, 10) || 0;

  let ledger;

  try {
    ledger = await Ledger.findOne({
      _id: ledger_id,
      user_id: req.user.id,
    }).select(["-user_id"]);
  } catch (error) {
    // for invalid mongodb objectId
    throw new ErrorResponse("Ledger not found", StatusCodes.NOT_FOUND);
  }

  if (!ledger) {
    throw new ErrorResponse("Ledger not found", StatusCodes.NOT_FOUND);
  }

  // TODO issue when there is no entry pertaining to the ledger

  const entriesCount = await Entry.find({
    $or: [{ debit_ledger: ledger._id }, { credit_ledger: ledger._id }],
  }).count();

  const entries = await Entry.find({
    $or: [{ debit_ledger: ledger._id }, { credit_ledger: ledger._id }],
  })
    .sort("-created_at")
    .populate("debit_ledger", "-user_id -balance")
    .populate("credit_ledger", "-user_id -balance")
    .select(["-user_id"])
    .skip(PAGE * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT);

  let balance = 0;

  if (entriesCount !== 0) {
    [{ balance }] = await Entry.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { debit_ledger: ledger._id },
                { credit_ledger: ledger._id },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          debit_amount: {
            $cond: [{ $eq: ["$debit_ledger", ledger._id] }, "$amount", 0],
          },
          credit_amount: {
            $cond: [{ $eq: ["$credit_ledger", ledger._id] }, "$amount", 0],
          },
        },
      },
      {
        $group: {
          _id: 0,
          debit_total: { $sum: "$debit_amount" },
          credit_total: { $sum: "$credit_amount" },
        },
      },
      {
        $project: {
          _id: 0,
          balance: { $subtract: ["$debit_total", "$credit_total"] },
        },
      },
    ]).exec();
  }

  const normalized_balance = ledger.balance;
  delete ledger._doc.balance; // removing the normalized balance from response

  res.status(StatusCodes.OK).json({
    skip: PAGE * PAGINATION_LIMIT,
    limit: PAGINATION_LIMIT,
    total: entriesCount,
    balance: balance + normalized_balance,
    ledger,
    entries,
  });
});

const viewTrialBalance = asyncHandler(async (req, res, next) => {});

module.exports = {
  viewLedgerStatement,
  viewTrialBalance,
};
