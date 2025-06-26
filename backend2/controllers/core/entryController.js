const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const { ErrorResponse } = require("../middlewares/errorMiddleware");

const getEntries = asyncHandler(async (req, res, next) => {
  res.send("get entries");
});

const getEntryById = asyncHandler(async (req, res, next) => {
  res.send("get entry by id");
});

const createEntry = asyncHandler(async (req, res, next) => {
  res.send("create entry");
});

const editEntry = asyncHandler(async (req, res, next) => {
  res.send("edit entry");
});

const archiveEntries = asyncHandler(async (req, res, next) => {
  res.send("archive entries");
});

module.exports = {
  createEntry,
  getEntryById,
  getEntries,
  editEntry,
  archiveEntries,
};
