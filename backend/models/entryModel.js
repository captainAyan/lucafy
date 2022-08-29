const mongoose = require("mongoose");
const { ENTRY_NARRATION_MAX_LENGTH } = require("../constants/policies");

const entrySchema = new mongoose.Schema(
  {
    debit_ledger: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Ledger",
    },
    credit_ledger: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Ledger",
    },
    narration: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: ENTRY_NARRATION_MAX_LENGTH,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

entrySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

entrySchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Entry", entrySchema);
