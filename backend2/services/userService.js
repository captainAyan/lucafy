const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const User = require("../models/userModel");

/**
 * @typedef {import('../constants/typedefs').User} User
 */

/**
 * Creates a new user and stores it in the database.
 *
 * @param {Object} userData - New user data.
 * @returns {Promise<User>} The created user.
 */
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
      throw createHttpError(StatusCodes.BAD_REQUEST, "User already exists");
    }
    throw err;
  }

  if (!user) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  return user;
}

/**
 * Retrieves a user by their MongoDB ID.
 *
 * @param {string} id - MongoDB ObjectId of the user.
 * @returns {Promise<User>} The user with the given ID.
 */
async function getUserById(id) {
  const user = await User.findById(id, "-password");
  if (!user) throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
  return user;
}

/**
 * Retrieves paginated list of users.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Number of users per page
 * @param {string} order - Sort order
 * @param {string} keyword - Search keyword to filter users
 * @returns {Promise<{
 *  skip: number,
 *  limit: number,
 *  total: number,
 *  users: Array<User>
 * }>}
 */
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

/**
 * Updates user data by ID.
 *
 * @param {string} id - MongoDB ObjectId of the user.
 * @param {Partial<User>} userData - fields to update
 * @returns {Promise<User>} The updated user.
 */
async function editUserById(id, userData) {
  const user = await getUserById(id);
  Object.assign(user, userData);

  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Email is already in use");
    }
    throw err;
  }

  return user;
}

/**
 * Authenticates a user by email and plaintext password.
 *
 * @param {string} email - User's email.
 * @param {string} plainPassword - Plaintext password.
 * @returns {Promise<User>} The authenticated user.
 */
async function authenticateUser(email, plainPassword) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) {
    throw createHttpError(
      StatusCodes.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  return user;
}

/**
 * Changes the password of a user after verifying the old password.
 *
 * @param {string} id - MongoDB ObjectId of the user.
 * @param {string} oldPassword - Current plaintext password.
 * @param {string} newPassword - New plaintext password.
 * @returns {Promise<User>} The user with updated password.
 */
async function changeUserPassword(id, oldPassword, newPassword) {
  const user = await User.findById(id).select("+password");
  if (!user) throw createHttpError(StatusCodes.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw createHttpError(StatusCodes.UNAUTHORIZED, "Invalid password");
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
