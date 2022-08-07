const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const {
  createSchema,
  editSchema,
  passwordChangeSchema,
} = require("../util/userValidationSchema");
const generateToken = require("../util/tokenGenerator");

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const response = {
        id: user.id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
      };

      res.status(StatusCodes.OK).json({
        ...response,
        token: generateToken({ id: user.id }),
      });
    } else {
      const error = new Error("Invalid credentials");
      error.status = StatusCodes.BAD_REQUEST;
      next(error);
    }
  } catch (error) {
    const error1 = new Error("Unknown error");
    error1.status = StatusCodes.INTERNAL_SERVER_ERROR;
    next(error1);
  }
});

const register = asyncHandler(async (req, res, next) => {
  const { error } = createSchema.validate(req.body);

  if (!error) {
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
      const user = await User.create({
        ...req.body,
        password: hash,
      });

      const response = {
        id: user.id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
      };

      res.status(StatusCodes.CREATED).json({
        ...response,
        token: generateToken({ id: user.id }),
      });
    } catch (error1) {
      let error2;
      if (error1.code === 11000) {
        error2 = new Error("Email already exists");
        error2.status = StatusCodes.BAD_REQUEST;
      } else {
        error2 = new Error("Unknown error");
        error2.status = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      next(error2);
    }
  } else {
    const error1 = new Error("Invalid input error");
    error1.status = StatusCodes.BAD_REQUEST;
    next(error1);
  }
});

module.exports = { login, register };
