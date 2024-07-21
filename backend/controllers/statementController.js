const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const json2csv = require("json2csv");

const Entry = require("../models/entryModel");
const Ledger = require("../models/ledgerModel");
const { ErrorResponse } = require("../middlewares/errorMiddleware");
const { PAGINATION_LIMIT } = require("../constants/policies");
const { INCOME, EXPENDITURE, ASSET } = require("../constants/ledgerTypes");
const mongoose = require("mongoose");

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
  }).select(["-user_id"]);

  // array of ledgers with normalized balances
  const ledgerWithNormalizedBalanceArray = [];

  /**
   * ledgerIdList is an array of ledger ids
   * In addition, the map function also populates the ledgerWithNormalizedBalanceArray
   */
  const ledgerIdList = ledgers.map((l) => {
    if (l.balance !== 0) ledgerWithNormalizedBalanceArray.push(l);
    return l._id;
  });

  // list of ledgers with the total of their debit side
  const debitResult = await Entry.aggregate([
    {
      $match: {
        debit_ledger: { $in: ledgerIdList },
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
        credit_ledger: { $in: ledgerIdList },
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
    tb[el.ledger.id] = { ...el };
  }

  // credit side value
  for (const el of creditResult) {
    if (!tb[el.ledger.id]) {
      tb[el.ledger.id] = { ...el };
      tb[el.ledger.id].total = -el.total;
    } else {
      tb[el.ledger.id].total -= el.total;
    }
  }

  // ledgers with normalized balances
  for (const el of ledgerWithNormalizedBalanceArray) {
    if (tb[el.id]) {
      tb[el.id].total += el.balance;
    } else {
      const balance = el.balance;
      delete el._doc.balance;

      tb[el.id] = {
        balance,
        ledger: el,
      };
    }
  }

  // final object
  const trialBalance = [];

  for (const el of Object.keys(tb)) {
    const balance = tb[el].total;
    delete tb[el].total;
    trialBalance.push({ balance, ...tb[el] });
  }

  res.status(StatusCodes.OK).json(trialBalance);
});

const viewMicroStatement = asyncHandler(async (req, res, next) => {
  const ledgers = await Ledger.find({
    type: { $in: [INCOME, EXPENDITURE, ASSET] },
    user_id: req.user.id,
  }).select(["balance", "id", "type", "name"]);

  // array of ledgers with normalized balances
  const ledgerWithNormalizedBalanceArray = [];

  /**
   * ledgerIdList is an array of ledger ids
   * In addition, the map function also populates the ledgerWithNormalizedBalanceArray
   */
  const ledgerIdList = ledgers.map((l) => {
    if (l.balance !== 0) ledgerWithNormalizedBalanceArray.push(l);
    return l._id;
  });

  // list of ledgers with the total of their debit side
  const debitResult = await Entry.aggregate([
    {
      $match: {
        debit_ledger: { $in: ledgerIdList },
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
        credit_ledger: { $in: ledgerIdList },
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
    select: "id type name",
  });
  await Ledger.populate(creditResult, {
    path: "ledger",
    select: "id type name",
  });

  // Now calculate the balances
  const tb = {};

  // debit side value
  for (const el of debitResult) {
    tb[el.ledger.id] = { ...el };
  }

  // credit side value
  for (const el of creditResult) {
    if (!tb[el.ledger.id]) {
      tb[el.ledger.id] = { ...el };
      tb[el.ledger.id].total = -el.total;
    } else {
      tb[el.ledger.id].total -= el.total;
    }
  }

  // ledgers with normalized balances
  for (const el of ledgerWithNormalizedBalanceArray) {
    if (tb[el.id]) {
      tb[el.id].total += el.balance;
    } else {
      const balance = el.balance;
      delete el._doc.balance;

      tb[el.id] = {
        balance,
        ledger: el,
      };
    }
  }

  // micro statement
  const statement = {
    asset: 0,
    income: 0,
    expenditure: 0,
  };

  for (const el of Object.keys(tb)) {
    const balance = tb[el].total;
    delete tb[el].total;
    const a = { balance, ...tb[el] };

    statement[a.ledger.type] += a.balance;
  }

  // Since incomes are credit type, therefore are negative
  statement.income *= -1;

  res.status(StatusCodes.OK).json(statement);
});

const viewCalendarHeatmap = asyncHandler(async (req, res, next) => {
  const user_id = mongoose.Types.ObjectId(req.user.id);

  const calendarHeatMap = await Entry.aggregate([
    {
      $match: { user_id },
    },

    {
      $project: {
        yearMonthDay: {
          $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
        },
      },
    },

    {
      $group: {
        _id: "$yearMonthDay",
        frequency: { $sum: 1 },
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        frequency: 1,
      },
    },
  ]).exec();

  res.status(StatusCodes.OK).json(calendarHeatMap);
});

const exportJournalStatement = asyncHandler(async (req, res, next) => {
  const entries = await Entry.find({ user_id: req.user.id })
    .populate("debit_ledger", "-user_id -balance")
    .populate("credit_ledger", "-user_id -balance")
    .select(["-user_id"]);

  const fields = [
    "id",
    "narration",
    "amount",
    "created_at",
    "debit_leader_id",
    "debit_leader_name",
    "debit_ledger_type",
    "debit_ledger_description",
    "credit_leader_id",
    "credit_leader_name",
    "credit_ledger_type",
    "credit_ledger_description",
  ];
  const opts = { fields };
  const response = [];

  for (const entry of entries) {
    response.push({
      id: entry.id,
      narration: entry.narration,
      amount: entry.amount,
      created_at: entry.created_at,
      debit_leader_id: entry.debit_ledger.id,
      debit_leader_name: entry.debit_ledger.name,
      debit_ledger_type: entry.debit_ledger.type,
      debit_ledger_description: entry.debit_ledger.description,
      credit_leader_id: entry.credit_ledger.id,
      credit_leader_name: entry.credit_ledger.name,
      credit_ledger_type: entry.credit_ledger.type,
      credit_ledger_description: entry.credit_ledger.description,
    });
  }

  res.status(StatusCodes.OK).send(json2csv.parse(response, opts));
});

module.exports = {
  viewLedgerStatement,
  viewTrialBalance,
  viewMicroStatement,
  viewCalendarHeatmap,
  exportJournalStatement,
};
