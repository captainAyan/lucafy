const { StatusCodes } = require("http-status-codes");
const createHttpError = require("http-errors");

const generateToken = require("../utilities/tokenGenerator");
const userService = require("../services/userService");
const {
  createSchema,
  editSchema,
  passwordChangeSchema,
  queryParamSchema,
} = require("../utilities/validation/userValidationSchema");

async function login(req, res) {
  const { email, password } = req.body;

  const user = await userService.authenticateUser(email, password);
  const response = {
    user,
    token: generateToken({ id: user.id }),
  };

  res.status(StatusCodes.OK).json(response);
}

async function register(req, res) {
  const { value: body, error } = createSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const user = await userService.createUser(body);
  const response = {
    user,
    token: generateToken({ id: user.id }),
  };

  res.status(StatusCodes.CREATED).json(response);
}

async function getProfile(req, res) {
  const profile = await userService.getUserById(req.user.id);
  res.status(StatusCodes.OK).json(profile);
}

async function editProfile(req, res) {
  const { value: body, error } = editSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const profile = await userService.editUserById(req.user.id, body);
  res.status(StatusCodes.OK).json(profile);
}

async function changePassword(req, res) {
  const { value: body, error } = passwordChangeSchema.validate(req.body);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const { oldPassword, newPassword } = body;
  await userService.changeUserPassword(req.user.id, oldPassword, newPassword);

  res.status(StatusCodes.OK).json({ message: "success" });
}

async function deleteProfile(req, res) {
  res.send("delete profile");
}

async function getUsers(req, res) {
  const { value: queryParams, error } = queryParamSchema.validate(req.query);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid query parameter");
  }

  const { page, limit, order, keyword } = queryParams;

  const users = await userService.getUsers(page, limit, order, keyword);

  res.status(StatusCodes.OK).json(users);
}

async function getUserById(req, res) {
  const user = await userService.getUserById(req.params.userId);
  res.status(StatusCodes.OK).json(user);
}

module.exports = {
  login,
  register,
  getProfile,
  editProfile,
  changePassword,
  deleteProfile,
  getUsers,
  getUserById,
};
