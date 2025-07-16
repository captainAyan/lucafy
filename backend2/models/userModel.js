const { Schema, model } = require("mongoose");
const {
  USER_FIRST_NAME_MAX_LENGTH,
  USER_MIDDLE_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  ADDRESS_MAX_LENGTH,
  USER_JOB_TITLE_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
  USER_BIO_MAX_LENGTH,
  USER_GENDER_ENUM,
} = require("../constants/policies");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: USER_FIRST_NAME_MAX_LENGTH,
    },
    middleName: {
      type: String,
      default: "",
      trim: true,
      maxlength: USER_MIDDLE_NAME_MAX_LENGTH,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: USER_LAST_NAME_MAX_LENGTH,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 1,
      maxlength: EMAIL_MAX_LENGTH,
    },
    password: {
      type: String,
      required: true,
      minlength: PASSWORD_MIN_LENGTH,
      maxlength: PASSWORD_MAX_LENGTH,
      select: false,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: USER_BIO_MAX_LENGTH,
    },
    organization: {
      type: String,
      default: "",
      trim: true,
      maxlength: ORGANIZATION_NAME_MAX_LENGTH,
    },
    jobTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: USER_JOB_TITLE_MAX_LENGTH,
    },
    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: ADDRESS_MAX_LENGTH,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: USER_GENDER_ENUM,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const options = {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    const obj = { ...ret };
    delete obj.password;
    return obj;
  },
};

UserSchema.set("toObject", options);
UserSchema.set("toJSON", options);

module.exports = model("User", UserSchema);
