const { Schema, model } = require("mongoose");

const {
  LEDGER_NAME_MAX_LENGTH,
  LEDGER_DESCRIPTION_MAX_LENGTH,
} = require("../constants/policies");

const LedgerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: LEDGER_NAME_MAX_LENGTH,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: LEDGER_DESCRIPTION_MAX_LENGTH,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    ledgerGroup: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "LedgerGroup",
    },
    book: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
  },
  { timestamps: true }
);

// Enforce uniqueness of name within the same book
LedgerSchema.index({ bookId: 1, name: 1 }, { unique: true });

LedgerSchema.virtual("id").get(function () {
  return this._id;
});

LedgerSchema.set("toObject", { virtuals: true, versionKey: false });
LedgerSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("Ledger", LedgerSchema);
