const mongoose = require("mongoose");
// require("dotenv").config({ path: "../.env" });
require("dotenv").config();

const BookMember = require("../models/bookMemberModel");

const db = process.env.MONGODB_URI;

mongoose
  .connect(db)
  .then(async () => {
    await BookMember.syncIndexes();

    console.log("Indexes synced!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit with failure
  });
