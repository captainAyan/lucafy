import type { Document } from "mongoose";
import { Schema, model } from "mongoose";

import {
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
} from "../../constants/policies.js";
import { UserGender } from "../../constants/policies.js";

export interface UserDocument extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  bio?: string;
  organization?: string;
  jobTitle?: string;
  address?: string;
  dateOfBirth: Date | null;
  gender?: UserGender;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
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
      // select: false,
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
      enum: Object.values(UserGender),
      default: UserGender.UNSPECIFIED,
    },
  },
  { timestamps: true },
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

export default model<UserDocument>("User", UserSchema);
