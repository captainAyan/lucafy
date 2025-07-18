const { Schema, model } = require("mongoose");
const LEDGER_TYPE = require("../constants/policies");

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
    type: {
      type: String,
      required: true,
      enum: LEDGER_TYPE,
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
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

LedgerSchema.virtual("id").get(function () {
  return this._id;
});

LedgerSchema.set("toObject", { virtuals: true, versionKey: false });
LedgerSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("Ledger", LedgerSchema);
