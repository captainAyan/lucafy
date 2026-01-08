const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const {
  createSchema,
} = require("../../../utilities/validation/book/core/entrySchema");
const entryUseCase = require("../../../services/book/core/entry/entryUseCase");

async function getEntries(req, res, next) {
  res.send("get entries");
}

async function getEntryById(req, res, next) {
  res.send("get entry by id");
}

async function createEntry(req, res, next) {
  const { value: entryValues, error } = createSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const entry = await entryUseCase.createEntry(req.body.id, entryValues);

  res.status(StatusCodes.CREATED).json(entry);
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
