const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const Entry = require("../../../../models/entryModel");

/**
 * @typedef {import('../../../../constants/typedefs').Entry} Entry
 */

async function createEntry(bookId, data) {}

module.exports = { createEntry };
