const { StatusCodes } = require("http-status-codes");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (err, req, res, _) => {
  const isProd = process.env.NODE_ENV === "production";

  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: {
      message: isProd ? "Internal server error" : err.message,
      stack: isProd ? null : err.stack,
      type: err.type || 0,
      code: err.code || 0,
    },
  });
};

module.exports = {
  ErrorResponse,
  errorHandler,
};
