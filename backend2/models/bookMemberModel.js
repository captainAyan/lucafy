const { Schema, model } = require("mongoose");

const {
  BOOK_MEMBER_ROLE: { ADMIN, MEMBER },
} = require("../constants/policies");

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
      enum: [ADMIN, MEMBER],
      required: true,
    },
  },
  { timestamps: true }
);

BookMemberSchema.index({ user: 1, book: 1 }, { unique: true });

BookMemberSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

BookMemberSchema.set("toObject", { virtuals: true, versionKey: false });
BookMemberSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("BookMember", BookMemberSchema);
