const mongoose = require("mongoose");
const {
  USER_FIRST_NAME_MAX_LENGTH,
  USER_MIDDLE_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_LOCATION_MAX_LENGTH,
  USER_JOB_TITLE_MAX_LENGTH,
  USER_ORGANIZATION_MAX_LENGTH,
  USER_BIO_MAX_LENGTH,
} = require("../constants/policies");

const userSchema = new mongoose.Schema({
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
    maxlength: USER_EMAIL_MAX_LENGTH,
  },
  password: {
    type: String,
    required: true,
    minlength: USER_PASSWORD_MIN_LENGTH,
    maxlength: USER_PASSWORD_MAX_LENGTH,
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
    maxlength: USER_ORGANIZATION_MAX_LENGTH,
  },
  jobTitle: {
    type: String,
    default: "",
    trim: true,
    maxlength: USER_JOB_TITLE_MAX_LENGTH,
  },
  location: {
    type: String,
    default: "",
    trim: true,
    maxlength: USER_LOCATION_MAX_LENGTH,
  },
});

module.exports = mongoose.model("User", userSchema);
