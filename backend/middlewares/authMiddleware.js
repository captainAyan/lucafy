const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const { getUserById } = require("../services/userService");

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
      throw createHttpError(StatusCodes.UNAUTHORIZED, "Not authenticated");
    }
  } else {
    throw createHttpError(StatusCodes.UNAUTHORIZED, "Not authenticated");
  }
}

module.exports = protect;
