const { Schema, model } = require("mongoose");

const {
  LEDGER_NATURE,
  LEDGER_GROUP_NAME_MAX_LENGTH,
  LEDGER_GROUP_DESCRIPTION_MAX_LENGTH,
} = require("../constants/policies");

const LedgerGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: LEDGER_GROUP_NAME_MAX_LENGTH,
    },
    nature: {
      type: String,
      required: true,
      enum: LEDGER_NATURE,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: LEDGER_GROUP_DESCRIPTION_MAX_LENGTH,
    },
    parent: {
      type: Schema.Types.ObjectId,
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
LedgerGroupSchema.index({ bookId: 1, name: 1 }, { unique: true });

LedgerGroupSchema.virtual("id").get(function () {
  return this._id;
});

LedgerGroupSchema.set("toObject", { virtuals: true, versionKey: false });
LedgerGroupSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("LedgerGroup", LedgerGroupSchema);
