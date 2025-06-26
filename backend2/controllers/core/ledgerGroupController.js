const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const { ErrorResponse } = require("../middlewares/errorMiddleware");

const getLedgerGroups = asyncHandler(async (req, res, next) => {
  res.send("get ledger groups");
});

const getLedgerGroupById = asyncHandler(async (req, res, next) => {
  res.send("get ledger group by id");
});

const createLedgerGroup = asyncHandler(async (req, res, next) => {
  res.send("create ledger group");
});

const editLedgerGroup = asyncHandler(async (req, res, next) => {
  res.send("edit ledger group");
});

module.exports = {
  createLedgerGroup,
  getLedgerGroups,
  getLedgerGroupById,
  editLedgerGroup,
};
