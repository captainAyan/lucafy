const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const { getUserById } = require("../services/userService");
const { ErrorResponse } = require("./errorMiddleware");

async function protect(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const user = await getUserById(decoded.id);
      req.user = user;

      next();
    } catch (err) {
      throw new ErrorResponse("Not authenticated", StatusCodes.UNAUTHORIZED);
    }
  } else {
    throw new ErrorResponse("Not authenticated", StatusCodes.UNAUTHORIZED);
  }
}

module.exports = protect;
