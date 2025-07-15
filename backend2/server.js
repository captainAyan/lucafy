const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const createHttpError = require("http-errors");

const errorHandler = require("./middlewares/errorMiddleware");
const { PER_MINUTE_REQUEST_LIMIT } = require("./constants/policies");

require("dotenv").config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = process.env.MONGODB_URI;
mongoose
  .connect(db)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit with failure
  });

// Graceful shutdown on SIGINT (e.g., Ctrl+C)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB disconnected on app termination");
  process.exit(0); // Exit cleanly
});

app.use(morgan("tiny"));

app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? PER_MINUTE_REQUEST_LIMIT : false,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    throw createHttpError(StatusCodes.TOO_MANY_REQUESTS, "Too many requests");
  },
});
app.use(limiter); // limits all paths

app.use("/api", require("./routes/api"));

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("/{*any}", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use("/{*any}", (req, res, next) => {
  throw createHttpError(StatusCodes.NOT_FOUND, "Not found");
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
