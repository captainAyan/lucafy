const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const {
  LEDGER_NATURE,
  LEDGER_GROUP_NAME_MAX_LENGTH,
  LEDGER_GROUP_DESCRIPTION_MAX_LENGTH,
} = require("../../../../constants/policies");

const createSchema = Joi.object({
  name: Joi.string().min(1).max(LEDGER_GROUP_NAME_MAX_LENGTH).required(),
  nature: Joi.string()
    .valid("", ...Object.values(LEDGER_NATURE))
    .required(),
  description: Joi.string()
    .min(1)
    .max(LEDGER_GROUP_DESCRIPTION_MAX_LENGTH)
    .required(),
  parentId: Joi.objectId().allow("").required(),
})
  .custom((obj, helpers) => {
    if (obj.nature && obj.parentId) {
      return helpers.error("any.invalid", {
        message: "Primary group (with nature) cannot have a parent.",
      });
    }
    if (!obj.nature && !obj.parentId) {
      return helpers.error("any.invalid", {
        message: "Child group must have a parent or nature must be defined.",
      });
    }
    return obj;
  }, "Parent/Nature consistency validation")
  .options({ stripUnknown: true });

const editSchema = createSchema;

module.exports = { createSchema, editSchema };
