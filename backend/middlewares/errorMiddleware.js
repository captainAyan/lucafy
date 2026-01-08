const { StatusCodes } = require("http-status-codes");
const { isHttpError } = require("http-errors");

const logError = (err) => {
  console.error("MESSAGE:", err.message);
  console.error("NAME:", err.name);
  console.error(
    "STATUS CODE:",
    `${err.status || StatusCodes.INTERNAL_SERVER_ERROR}`
  );
  console.error("STACK:", err.stack);
};

const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  logError(err);

  const statusCode = isHttpError(err)
    ? err.status
    : StatusCodes.INTERNAL_SERVER_ERROR;

  const errorResponse = {
    error: {
      statusCode,
      message: err.message || "An unexpected error occurred",
      name: err.name || "Error",
      timestamp: new Date().toISOString(),
    },
  };

  if (err.details) {
    errorResponse.error.details = err.details; // optional custom field
  }

  if (!isProd && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
