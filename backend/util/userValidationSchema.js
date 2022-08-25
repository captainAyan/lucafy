const Joi = require("joi");

const {
  USER_FIRST_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
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
  lastName: Joi.string().min(1).max(USER_LAST_NAME_MAX_LENGTH).required(),
  email: Joi.string().email().min(1).max(USER_EMAIL_MAX_LENGTH).required(),
});

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(USER_PASSWORD_MIN_LENGTH)
    .max(USER_PASSWORD_MAX_LENGTH)
    .required(),
});

module.exports = { createSchema, editSchema, passwordChangeSchema };
