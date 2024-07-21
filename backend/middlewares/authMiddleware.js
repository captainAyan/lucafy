const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const { ErrorResponse } = require("./errorMiddleware");

const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ErrorResponse("User does not exist", StatusCodes.BAD_REQUEST);
    }

    req.user = user;

    next();
  } else {
    throw new ErrorResponse("Not authenticated", StatusCodes.UNAUTHORIZED);
  }
});

module.exports = { protect };
