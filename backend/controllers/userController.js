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

  const user = await User.findOne({ email }).select("+password");

  if (user && (await bcrypt.compare(password, user.password))) {
    const userObj = user.toObject();
    delete userObj.password;

    res.status(StatusCodes.OK).json({
      ...userObj,
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

  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  let user;
  try {
    user = await User.create({
      ...req.body,
      password: hash,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate email error
      throw new ErrorResponse("User already exists", StatusCodes.BAD_REQUEST);
    }
    throw err;
  }

  if (!user) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const userObj = user.toObject();
  delete userObj.password;

  res.status(StatusCodes.CREATED).json({
    ...userObj,
    token: generateToken({ id: user._id }),
  });
});

const getProfile = asyncHandler(async (req, res, next) => {
  res.status(StatusCodes.OK).json(req.user);
});

const editProfile = asyncHandler(async (req, res, next) => {
  const { error } = editSchema.validate(req.body);
  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new ErrorResponse("User not found", StatusCodes.NOT_FOUND);
  }

  // Check email uniqueness only if email changed
  if (req.body.email && user.email !== req.body.email) {
    const userWithEmailExists = await User.findOne({ email: req.body.email });
    if (userWithEmailExists) {
      throw new ErrorResponse("Email is taken", StatusCodes.BAD_REQUEST);
    }
  }

  // List of fields allowed to be updated
  const allowedFields = [
    "firstName",
    "middleName",
    "lastName",
    "email",
    "bio",
    "organization",
    "jobTitle",
    "location",
    // add new fields here as you expand your schema
  ];

  // Update only allowed fields dynamically
  allowedFields.forEach((field) => {
    if (field in req.body) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  res.status(StatusCodes.OK).json(userObj);
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { error } = passwordChangeSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const { oldPassword, newPassword } = req.body;

  let user;
  try {
    user = await User.findById(req.user.id).select("+password");
  } catch {
    throw new ErrorResponse("User not found", StatusCodes.NOT_FOUND);
  }

  if (!user) {
    throw new ErrorResponse("User not found", StatusCodes.NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ErrorResponse("Invalid password", StatusCodes.BAD_REQUEST);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(StatusCodes.OK).json({ message: "success" });
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
