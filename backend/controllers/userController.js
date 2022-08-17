const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");

const {
  createSchema,
  editSchema,
  passwordChangeSchema,
} = require("../util/userValidationSchema");
const generateToken = require("../util/tokenGenerator");

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

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
    throw new ErrorResponse("Invalid credentials", StatusCodes.BAD_REQUEST);
  }
});

const register = asyncHandler(async (req, res, next) => {
  const { error } = createSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ErrorResponse("User already exists", StatusCodes.BAD_REQUEST);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    ...req.body,
    password: hash,
  });

  if (!user) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

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
});

const getProfile = asyncHandler(async (req, res, next) => {
  const response = {
    id: req.user.id,
    firstName: req.user.firstName,
    middleName: req.user.middleName,
    lastName: req.user.lastName,
    email: req.user.email,
  };

  res.status(StatusCodes.OK).json(response);
});

const editProfile = asyncHandler(async (req, res, next) => {
  const { error } = editSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCode.BAD_REQUEST);
  }
  const { firstName, middleName, lastName, email } = req.body;

  const user = await User.findById(req.user.id).select("-password");

  const userWithEmailExists = await User.findOne({ email });

  if (user.email !== email && userWithEmailExists) {
    throw new ErrorResponse("Email is taken", StatusCodes.BAD_REQUEST);
  }

  user.firstName = firstName;
  user.middleName = middleName;
  user.lastName = lastName;
  user.email = email;

  await user.save();

  const response = {
    id: user.id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
  };

  res.status(StatusCodes.OK).json(response);
});

const deleteProfile = asyncHandler(async (req, res, next) => {
  await User.deleteOne({ _id: req.user.id });

  // TODO delete other related data

  res.status(StatusCodes.OK).json({
    id: req.user.id,
  });
});

module.exports = { login, register, getProfile, editProfile, deleteProfile };
