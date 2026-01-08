const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/profile", require("./profileRoutes"));
router.use("/ledger", require("./ledgerRoutes"));
router.use("/entry", require("./entryRoutes"));
router.use("/statement", require("./statementRoutes"));

module.exports = router;
