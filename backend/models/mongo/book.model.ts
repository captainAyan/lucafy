import type { Document } from "mongoose";
import { Schema, model } from "mongoose";

import {
  ORGANIZATION_NAME_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
} from "../../constants/policies.js";
import { CurrencyCode } from "../../constants/currencyCodes.js";

export interface BookDocument extends Document {
  organization: string;
  address: string;
  currencyCode: CurrencyCode;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<BookDocument>(
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
      enum: CurrencyCode,
    },
  },
  { timestamps: true },
);

BookSchema.set("toObject", { virtuals: true, versionKey: false });
BookSchema.set("toJSON", { virtuals: true, versionKey: false });

export default model<BookDocument>("Book", BookSchema);
