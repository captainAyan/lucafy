const express = require("express");

const router = express.Router();

router.use("/ledger", require("./ledgerRoutes"));
// router.use("/entry", require("./entryRoutes"));
router.use("/ledgerGroup", require("./ledgerGroupRoutes"));

module.exports = router;
