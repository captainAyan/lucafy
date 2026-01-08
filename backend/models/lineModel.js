const { Schema, model } = require("mongoose");

const { LEDGER_SIDES } = require("../constants/policies");

const LineSchema = new Schema(
  {
    entry: {
      type: Schema.Types.ObjectId,
      ref: "Entry",
      required: true,
      index: true,
    },
    ledger: {
      type: Schema.Types.ObjectId,
      ref: "Ledger",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    side: {
      type: String,
      enum: LEDGER_SIDES,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { timestamps: true }
);

// Enforces uniqueness for the ledgers for an entry lines
LineSchema.index({ entry: 1, ledger: 1 }, { unique: true });

LineSchema.set("toObject", { virtuals: true, versionKey: false });
LineSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("Line", LineSchema);
