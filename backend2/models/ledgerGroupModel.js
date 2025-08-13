const { Schema, model, Error } = require("mongoose");

const {
  LEDGER_TYPE,
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
      enum: LEDGER_TYPE,
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

// Ensure mutual exclusivity between 'nature' and 'parent'
function validateNatureAndParent(nature, parent) {
  if (nature && parent) {
    return new Error("Primary ledger group cannot have a parent.");
  }
  if (!nature && !parent) {
    return new Error("Child ledger group must have a parent.");
  }
  return null;
}

LedgerGroupSchema.pre("save", function (next) {
  const err = validateNatureAndParent(this.nature, this.parent);
  return err ? next(err) : next();
});

LedgerGroupSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate();

  const nature = update.nature ?? update.$set?.nature;
  const parent = update.parent ?? update.$set?.parent;

  const err = validateNatureAndParent(nature, parent);
  return err ? next(err) : next();
});

LedgerGroupSchema.virtual("id").get(function () {
  return this._id;
});

LedgerGroupSchema.set("toObject", { virtuals: true, versionKey: false });
LedgerGroupSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("LedgerGroup", LedgerGroupSchema);
