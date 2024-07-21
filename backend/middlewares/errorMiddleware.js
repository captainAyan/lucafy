const { StatusCodes } = require("http-status-codes");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (err, req, res, _) => {
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: {
      // actual error message
      message: err.message,
      // shows the error stack in 'development' mode
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
      type: err.type || 0,
      code: err.code || 0,
    },
  });
};

module.exports = {
  ErrorResponse,
  errorHandler,
};
