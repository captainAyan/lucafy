const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const { errorHandler } = require("./middleware/errorMiddleware");

require("dotenv").config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = process.env.MONGODB_URI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(morgan("tiny"));

app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: process.env.NODE_ENV === "production" ? 100 : false,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const error = new Error("Too many requests");
    error.status = StatusCodes.TOO_MANY_REQUESTS;
    next(error);
  },
});
app.use(limiter); // limits all paths

app.use("/api", require("./routes/api"));

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use("*", (req, res, next) => {
  const error = new Error("Not found");
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
