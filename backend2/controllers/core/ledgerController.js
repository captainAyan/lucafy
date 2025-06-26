const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const { ErrorResponse } = require("../middlewares/errorMiddleware");

const getLedgers = asyncHandler(async (req, res, next) => {
  res.send("get ledgers");
});

const getAllLedgers = asyncHandler(async (req, res, next) => {
  res.send("get all ledgers");
});

const getLedgerById = asyncHandler(async (req, res, next) => {
  res.send("get ledger by id");
});

const createLedger = asyncHandler(async (req, res, next) => {
  res.send("create ledger");
});

const editLedger = asyncHandler(async (req, res, next) => {
  res.send("edit ledger");
});

const viewLedgerStatement = asyncHandler(async (req, res, next) => {
  res.send("view ledger statement");
});

module.exports = {
  createLedger,
  getLedgers,
  getAllLedgers,
  getLedgerById,
  editLedger,
  viewLedgerStatement,
};
