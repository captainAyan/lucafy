const { Schema, model } = require("mongoose");
const { ENTRY_NARRATION_MAX_LENGTH } = require("../constants/policies");

const EntrySchema = new Schema(
  {
    debit_ledger: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Ledger",
    },
    credit_ledger: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

EntrySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

EntrySchema.set("toObject", { virtuals: true, versionKey: false });
EntrySchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("Entry", EntrySchema);
