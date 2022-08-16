const mongoose = require("mongoose");
const {
  INCOME,
  EXPENDITURE,
  ASSET,
  LIABILITY,
  EQUITY,
} = require("../constants/ledgerTypes");

const ledgerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
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
      minlength: 0,
      maxlength: 200,
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

module.exports = mongoose.model("Ledger", ledgerSchema);
