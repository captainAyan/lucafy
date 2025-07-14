const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const { ErrorResponse } = require("../middlewares/errorMiddleware");

const viewTrialBalance = asyncHandler(async (req, res, next) => {
  res.send("view trial balance as on date");
});

const viewMicroStatement = asyncHandler(async (req, res, next) => {
  res.send("view micro-statement");
});

const viewCalendarHeatmap = asyncHandler(async (req, res, next) => {
  res.send("view calendar heatmap");
});

const exportJournalStatement = asyncHandler(async (req, res, next) => {
  res.send("exportable journal statement");
});

module.exports = {
  viewTrialBalance,
  viewMicroStatement,
  viewCalendarHeatmap,
  exportJournalStatement,
};
