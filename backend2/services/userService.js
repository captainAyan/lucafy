const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../middlewares/errorMiddleware");
const User = require("../models/userModel");

async function createUser(userData) {
  const { password } = userData;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  let user;
  try {
    user = await User.create({
      ...userData,
      password: hash,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new ErrorResponse("User already exists", StatusCodes.BAD_REQUEST);
    }
    throw err;
  }

  if (!user) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  return user;
}

async function getUserById(id) {
  const user = await User.findById(id, "-password");
  if (!user) throw new ErrorResponse("User not found", StatusCodes.NOT_FOUND);
  return user;
}

async function getUsers(page, limit, order, keyword) {
  const sortOrder = order === "oldest" ? "createdAt" : "-createdAt";

  const query = {};

  if (keyword && keyword.trim() !== "") {
    const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i"); // case-insensitive
    query.$or = [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
      { email: { $regex: regex } },
    ];
  }

  const users = await User.find(query)
    .sort(sortOrder)
    .skip(page * limit)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    skip: page * limit,
    limit,
    total,
    users,
  };
}

async function editUserById(id, userData) {
  const user = await getUserById(id);
  Object.assign(user, userData);

  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new ErrorResponse(
        "Email is already in use",
        StatusCodes.BAD_REQUEST
      );
    }
    throw err;
  }

  return user;
}

async function authenticateUser(email, plainPassword) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorResponse("Invalid email or password");

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) {
    throw new ErrorResponse(
      "Invalid email or password",
      StatusCodes.UNAUTHORIZED
    );
  }

  return user;
}

async function changeUserPassword(id, oldPassword, newPassword) {
  const user = await User.findById(id).select("+password");
  if (!user) throw new ErrorResponse("User not found", StatusCodes.NOT_FOUND);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ErrorResponse("Invalid password", StatusCodes.BAD_REQUEST);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  return user;
}

module.exports = {
  createUser,
  getUserById,
  getUsers,
  editUserById,
  authenticateUser,
  changeUserPassword,
};
