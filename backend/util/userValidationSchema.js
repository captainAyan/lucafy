const Joi = require("joi");

const {
  USER_FIRST_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_MIDDLE_NAME_MAX_LENGTH,
  USER_BIO_MAX_LENGTH,
  USER_ORGANIZATION_MAX_LENGTH,
  USER_JOB_TITLE_MAX_LENGTH,
  USER_LOCATION_MAX_LENGTH,
} = require("../constants/policies");

const createSchema = Joi.object({
  firstName: Joi.string().min(1).max(USER_FIRST_NAME_MAX_LENGTH).required(),
  lastName: Joi.string().min(1).max(USER_LAST_NAME_MAX_LENGTH).required(),
  email: Joi.string().email().min(1).max(USER_EMAIL_MAX_LENGTH).required(),
  password: Joi.string()
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
});

const editSchema = Joi.object({
  firstName: Joi.string().min(1).max(USER_FIRST_NAME_MAX_LENGTH).required(),
  middleName: Joi.string()
    .max(USER_MIDDLE_NAME_MAX_LENGTH)
    .allow("")
    .optional(),
  lastName: Joi.string().min(1).max(USER_LAST_NAME_MAX_LENGTH).required(),
  email: Joi.string().email().min(1).max(USER_EMAIL_MAX_LENGTH).required(),
  bio: Joi.string().max(USER_BIO_MAX_LENGTH).allow("").optional(),
  organization: Joi.string()
    .max(USER_ORGANIZATION_MAX_LENGTH)
    .allow("")
    .optional(),
  jobTitle: Joi.string().max(USER_JOB_TITLE_MAX_LENGTH).allow("").optional(),
  location: Joi.string().max(USER_LOCATION_MAX_LENGTH).allow("").optional(),
});

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
});

module.exports = { createSchema, editSchema, passwordChangeSchema };
