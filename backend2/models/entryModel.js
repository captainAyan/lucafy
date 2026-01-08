const { Schema, model } = require("mongoose");
const { ENTRY_NARRATION_MAX_LENGTH } = require("../constants/policies");

const EntrySchema = new Schema(
  {
    narration: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: ENTRY_NARRATION_MAX_LENGTH,
    },
    book: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
  },
  { timestamps: true }
);

EntrySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

EntrySchema.virtual("lines", {
  ref: "Line",
  localField: "_id",
  foreignField: "entry",
});

EntrySchema.set("toObject", { virtuals: true, versionKey: false });
EntrySchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("Entry", EntrySchema);
