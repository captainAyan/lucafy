const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Entry = require("../models/entryModel");
const Ledger = require("../models/ledgerModel");
const { ErrorResponse } = require("../middlewares/errorMiddleware");

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
    lastName: req.user.lastName,
    email: req.user.email,
  };

  res.status(StatusCodes.OK).json(response);
});

const editProfile = asyncHandler(async (req, res, next) => {
  const { error } = editSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }
  const { firstName, lastName, email } = req.body;

  const user = await User.findById(req.user.id).select("-password");

  const userWithEmailExists = await User.findOne({ email });

  if (user.email !== email && userWithEmailExists) {
    throw new ErrorResponse("Email is taken", StatusCodes.BAD_REQUEST);
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;

  await user.save();

  const response = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  res.status(StatusCodes.OK).json(response);
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { error } = passwordChangeSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const { oldPassword, newPassword } = req.body;
  let user;

  try {
    user = await User.findOne({ _id: req.user.id });
  } catch (error) {
    // for invalid mongodb objectid
    throw new ErrorResponse("User not found", StatusCodes.NOT_FOUND);
  }

  if (!user) {
    throw new ErrorResponse("User not found", StatusCodes.NOT_FOUND);
  }

  if (user && (await bcrypt.compare(oldPassword, user.password))) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;

    await user.save();

    const response = { message: "success" };

    res.status(StatusCodes.OK).json(response);
  } else {
    throw new ErrorResponse("Invalid password", StatusCodes.BAD_REQUEST);
  }
});

const deleteProfile = asyncHandler(async (req, res, next) => {
  await User.deleteOne({ _id: req.user.id });
  await Entry.deleteMany({ user_id: req.user.id });
  await Ledger.deleteMany({ user_id: req.user.id });

  res.status(StatusCodes.OK).json({
    id: req.user.id,
  });
});

module.exports = {
  login,
  register,
  getProfile,
  editProfile,
  changePassword,
  deleteProfile,
};
