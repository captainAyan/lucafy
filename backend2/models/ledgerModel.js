const { Schema, model } = require("mongoose");

const {
  // LEDGER_TYPE,
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
    // type: {
    //   type: String,
    //   required: true,
    //   enum: LEDGER_TYPE,
    // },
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
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    book: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
  },
  { timestamps: true }
);

LedgerSchema.statics.findWithGroupHierarchy = async function (filter = {}) {
  return this.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "ledgergroups",
        localField: "group",
        foreignField: "_id",
        as: "group",
      },
    },
    {
      $unwind: {
        path: "$group",
        preserveNullAndEmptyArrays: true,
      },
    },
    // Recursive $graphLookup to fetch parent groups up to the root
    {
      $graphLookup: {
        from: "ledgergroups",
        startWith: "$group.parent",
        connectFromField: "parentLedgerGroupId",
        connectToField: "_id",
        as: "groupHierarchy",
        depthField: "level",
      },
    },
    {
      $addFields: {
        group: {
          $concatArrays: [
            [{ $ifNull: ["$group", null] }],
            { $ifNull: ["$groupHierarchy", []] },
          ],
        },
      },
    },
    {
      $lookup: {
        from: "users", // Assuming the creator is a User and 'users' is the collection name
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $unwind: {
        path: "$creator",
        preserveNullAndEmptyArrays: true, // In case there is no creator populated
      },
    },
    {
      $project: {
        groupHierarchy: 0, // Remove redundant field
        "creator.password": 0, // Don't include sensitive fields like password in creator
      },
    },
  ]);
};

LedgerSchema.statics.findOneWithGroupHierarchy = async function (filter = {}) {
  const results = await this.findWithGroupHierarchy(filter);
  return results[0] || null;
};

LedgerSchema.virtual("id").get(function () {
  return this._id;
});

LedgerSchema.set("toObject", { virtuals: true, versionKey: false });
LedgerSchema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = model("Ledger", LedgerSchema);
