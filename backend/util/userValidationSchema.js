const Joi = require("joi");

const createSchema = Joi.object({
  firstName: Joi.string().min(1).max(191).required(),
  lastName: Joi.string().min(1).max(191).required(),
  middleName: Joi.string().min(0).max(191),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(191).required(),
});

const editSchema = Joi.object({
  firstName: Joi.string().min(1).max(191),
  lastName: Joi.string().min(1).max(191),
  middleName: Joi.string().min(0).max(191),
});

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(191).required(),
});

module.exports = { createSchema, editSchema, passwordChangeSchema };
