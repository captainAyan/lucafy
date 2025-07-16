const { Schema, model } = require("mongoose");

const {
  ORGANIZATION_NAME_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
  CURRENCY_CODE_ENUM,
} = require("../constants/policies");

const BookSchema = new Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: ORGANIZATION_NAME_MAX_LENGTH,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: ADDRESS_MAX_LENGTH,
    },
    currencyCode: {
      type: String,
      required: true,
      enum: CURRENCY_CODE_ENUM,
    },
  },
  { timestamps: true }
);

BookSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

BookSchema.set("toObject", { virtuals: true, versionKey: false });
BookSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("Book", BookSchema);
