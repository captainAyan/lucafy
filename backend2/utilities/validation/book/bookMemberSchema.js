const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const {
  BOOK_MEMBER_ROLE: { ADMIN, MEMBER },
} = require("../../../constants/policies");

const createSchema = Joi.object({
  userId: Joi.objectId().required(),
  role: Joi.string().valid(ADMIN, MEMBER).required(),
}).options({ stripUnknown: true });

const editSchema = Joi.object({
  role: Joi.string().valid(ADMIN, MEMBER).required(),
}).options({ stripUnknown: true });

module.exports = {
  createSchema,
  editSchema,
};
