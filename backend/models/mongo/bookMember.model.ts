import type { Document, Types } from "mongoose";
import { Schema, model } from "mongoose";

import { BookMemberRole } from "../../constants/policies.js";

export interface BookMemberDocument extends Document {
  user: Types.ObjectId;
  book: Types.ObjectId;
  role: BookMemberRole;
  createdAt: Date;
  updatedAt: Date;
}

const BookMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    role: {
      type: String,
      enum: BookMemberRole,
      required: true,
    },
  },
  { timestamps: true },
);

BookMemberSchema.index({ user: 1, book: 1 }, { unique: true });

BookMemberSchema.set("toObject", { virtuals: true, versionKey: false });
BookMemberSchema.set("toJSON", { virtuals: true, versionKey: false });

export default model<BookMemberDocument>("BookMember", BookMemberSchema);
