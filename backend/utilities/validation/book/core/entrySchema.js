const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const {
  ENTRY_NARRATION_MAX_LENGTH,
  LEDGER_SIDES,
} = require("../../../../constants/policies");

const lineSchema = Joi.object({
  ledgerId: Joi.objectId().required(),
  side: Joi.string()
    .valid(...Object.values(LEDGER_SIDES))
    .required(),
  amount: Joi.number().greater(0).integer().required(),
}).options({ stripUnknown: true });

const createSchema = Joi.object({
  narration: Joi.string().min(1).max(ENTRY_NARRATION_MAX_LENGTH).required(),
  lines: Joi.array().min(2).items(lineSchema).required(),
})
  .custom((value, helpers) => {
    const { lines } = value;

    let debitCount = 0;
    let creditCount = 0;
    let debitTotal = 0;
    let creditTotal = 0;

    const ledgerIds = new Set();

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.side === LEDGER_SIDES.DEBIT) {
        debitCount += 1;
        debitTotal += line.amount;
      } else {
        creditCount += 1;
        creditTotal += line.amount;
      }

      if (ledgerIds.has(line.ledgerId))
        return helpers.error("any.invalid", {
          message:
            "A journal entry cannot contain multiple lines with the same ledger",
        });
      ledgerIds.add(line.id);
    }

    if (debitCount === 0 || creditCount === 0) {
      return helpers.error("any.invalid", {
        message: "Entry must contain at least one debit and one credit line",
      });
    }

    if (debitCount > 1 && creditCount !== 1) {
      return helpers.error("any.invalid", {
        message: "Multiple debit lines require exactly one credit line",
      });
    }

    if (creditCount > 1 && debitCount !== 1) {
      return helpers.error("any.invalid", {
        message: "Multiple credit lines require exactly one debit line",
      });
    }

    if (debitTotal !== creditTotal) {
      return helpers.error("any.invalid", {
        message: "Debit total must equal credit total",
      });
    }

    return value;
  })
  .options({ stripUnknown: true });

// const editSchema = Joi.object({
//   narration: Joi.string().min(1).max(ENTRY_NARRATION_MAX_LENGTH).required(),
// }).options({ stripUnknown: true });

module.exports = { createSchema };
