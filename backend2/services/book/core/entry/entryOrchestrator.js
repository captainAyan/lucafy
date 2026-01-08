const mongoose = require("mongoose");

const entryService = require("./entryService");
const lineService = require("./lineService");
const ledgerService = require("../ledger/ledgerService");

async function createEntry(entryData) {
  const { lines, narration } = entryData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    entryService.createEntry(narration, session);

    for (const i = 0; i < lines.length; i++) {
      const line = lines[i];
      lineService.createLine(line, session);

      // ledgerService.updateBalance();
    }

    return;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = {
  createEntry,
};
