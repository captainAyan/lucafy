const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

async function getEntries(req, res, next) {
  res.send("get entries");
}

async function getEntryById(req, res, next) {
  res.send("get entry by id");
}

async function createEntry(req, res, next) {
  res.send("create entry");
}

async function editEntry(req, res, next) {
  res.send("edit entry");
}

module.exports = {
  createEntry,
  getEntryById,
  getEntries,
  editEntry,
};
