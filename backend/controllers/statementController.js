const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
var mongoose = require("mongoose");

const Entry = require("../models/entryModel");
const Ledger = require("../models/ledgerModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");
const { PAGINATION_LIMIT } = require("../constants/policies");

const viewLedgerStatement = asyncHandler(async (req, res, next) => {
  const { id: ledger_id } = req.params;
  const PAGE =
    parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 0;

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
            // don't know if this $and is needed or not
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

const viewTrialBalance = asyncHandler(async (req, res, next) => {
  const ledgers = await Ledger.find({
    user_id: req.user.id,
  }).select(["balance"]);

  // key-value pair list <ledger id, balance> (balance is the normalized balance)
  const normalizedBalanceList = {};

  /**
   * ledgerList is an array of ledger ids
   * In addition, the map function also populates the normalizedBalanceList
   */
  const ledgerList = ledgers.map((l) => {
    normalizedBalanceList[l._id] = l.balance;
    return l._id;
  });

  // list of ledgers with the total of their debit side
  const debitResult = await Entry.aggregate([
    {
      $match: {
        debit_ledger: { $in: ledgerList },
      },
    },

    {
      $group: {
        _id: "$debit_ledger",
        total: { $sum: "$amount" },
      },
    },

    {
      $project: {
        _id: 0,
        ledger: "$_id",
        total: 1,
      },
    },
  ]).exec();

  // list of ledgers with the total of their credit side
  const creditResult = await Entry.aggregate([
    {
      $match: {
        credit_ledger: { $in: ledgerList },
      },
    },

    {
      $group: {
        _id: "$credit_ledger",
        total: { $sum: "$amount" },
      },
    },

    {
      $project: {
        _id: 0,
        ledger: "$_id",
        total: 1,
      },
    },
  ]).exec();

  // populating with other ledger values for the
  await Ledger.populate(debitResult, {
    path: "ledger",
    select: "-user_id -balance",
  });
  await Ledger.populate(creditResult, {
    path: "ledger",
    select: "-user_id -balance",
  });

  // Now calculate the balances
  const tb = {};

  // debit side value
  for (const el of debitResult) {
    tb[el.ledger.id] = el;
  }

  // credit side value
  for (const el of creditResult) {
    if (!tb[el.ledger.id]) {
      tb[el.ledger.id] = {
        total: el.total * -1,
        ...el,
      };
    } else {
      tb[el.ledger.id].total -= el.total;
    }
  }

  // final object
  const trial_balance = [];

  for (const el of Object.keys(tb)) {
    const balance = tb[el].total + normalizedBalanceList[el];
    delete tb[el].total;
    trial_balance.push({ balance, ...tb[el] });
  }

  res.status(StatusCodes.OK).json(trial_balance);
});

module.exports = {
  viewLedgerStatement,
  viewTrialBalance,
};
