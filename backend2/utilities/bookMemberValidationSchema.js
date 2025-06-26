const Joi = require("joi");

const {
  BOOK_MEMBER_ROLES: { ADMIN, MEMBER },
} = require("../constants/policies");

const createSchema = Joi.object({
  user: Joi.objectId().required(),
  book: Joi.objectId().required(),
  role: Joi.string().valid(ADMIN, MEMBER).required(),
}).options({ stripUnknown: true });

module.exports = {
  createSchema,
};
