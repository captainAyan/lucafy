const Joi = require("joi");

const {
  USER_FIRST_NAME_MAX_LENGTH,
  USER_MIDDLE_NAME_MAX_LENGTH,
  USER_LAST_NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USER_BIO_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
  USER_JOB_TITLE_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
  USER_GENDER,
} = require("../../constants/policies");

const createSchema = Joi.object({
  firstName: Joi.string().min(1).max(USER_FIRST_NAME_MAX_LENGTH).required(),
  lastName: Joi.string().min(1).max(USER_LAST_NAME_MAX_LENGTH).required(),
  email: Joi.string().email().min(1).max(EMAIL_MAX_LENGTH).required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
}).options({ stripUnknown: true });

const editSchema = Joi.object({
  firstName: Joi.string().min(1).max(USER_FIRST_NAME_MAX_LENGTH).required(),
  middleName: Joi.string()
    .max(USER_MIDDLE_NAME_MAX_LENGTH)
    .allow("")
    .optional(),
  lastName: Joi.string().min(1).max(USER_LAST_NAME_MAX_LENGTH).required(),
  email: Joi.string().email().min(1).max(EMAIL_MAX_LENGTH).required(),
  bio: Joi.string().max(USER_BIO_MAX_LENGTH).allow("").optional(),
  organization: Joi.string()
    .max(ORGANIZATION_NAME_MAX_LENGTH)
    .allow("")
    .optional(),
  jobTitle: Joi.string().max(USER_JOB_TITLE_MAX_LENGTH).allow("").optional(),
  address: Joi.string().max(ADDRESS_MAX_LENGTH).allow("").optional(),
  dateOfBirth: Joi.date().optional().allow(null),
  gender: Joi.string()
    .valid(...Object.values(USER_GENDER)) // .allow("") is not needed as USER_GENDER.UNSPECIFIED = ""
    .optional(),
}).options({ stripUnknown: true });

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
}).options({ stripUnknown: true });

module.exports = {
  createSchema,
  editSchema,
  passwordChangeSchema,
};
