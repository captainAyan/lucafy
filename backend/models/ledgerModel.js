const mongoose = require("mongoose");
const {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} = require("../constants/ledgerTypes");

const {
  LEDGER_NAME_MAX_LENGTH,
  LEDGER_DESCRIPTION_MAX_LENGTH,
} = require("../constants/policies");

const ledgerSchema = new mongoose.Schema(
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
      enum: [INCOME, EXPENDITURE, ASSET, LIABILITY, EQUITY],
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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ledgerSchema.virtual("id").get(function () {
  return this._id;
});

ledgerSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Ledger", ledgerSchema);
