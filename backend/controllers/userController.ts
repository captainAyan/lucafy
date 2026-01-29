import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

import generateToken from "../utilities/tokenGenerator.js";
import {
  authenticateUser,
  createUser,
  getUserById as _getUserById,
  editUserById,
  getUsers as _getUsers,
} from "../services/user/userService.js";
import {
  createUserSchema,
  editUserSchema,
  passwordChangeSchema,
  userLoginSchema,
} from "../utilities/validation/userSchema.js";
import { paginationQueryParamSchemaWithKeyword } from "../utilities/validation/paginationQueryParamSchema.js";
import type CreateUserDto from "../dtos/user/createUserDto.js";
import type UserLoginDto from "../dtos/user/userLoginDto.js";
import type UserResponseDto from "../dtos/user/userResponseDto.js";
import type AuthenticationResponseDto from "../dtos/user/authenticationResponseDto.js";

export async function login(req: Request, res: Response) {
  const result = userLoginSchema.safeParse(req.body);

  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const loginData: UserLoginDto = result.data;

  const auth: AuthenticationResponseDto = await authenticateUser(loginData);

  res.status(StatusCodes.OK).json(auth);
}

export async function register(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const data: CreateUserDto = result.data;

  const registeredUser = await createUser(data);
  const auth = await authenticateUser({
    email: data.email,
    password: data.password,
  });

  res.status(StatusCodes.CREATED).json(auth);
}

export async function getProfile(req: Request, res: Response) {
  const profile = await _getUserById(req.user.id);
  res.status(StatusCodes.OK).json(profile);
}

export async function editProfile(req: Request, res: Response) {
  const { value: body, error } = editSchema.validate(req.body);
  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const profile = await editUserById(req.user.id, body);
  res.status(StatusCodes.OK).json(profile);
}

export async function changePassword(req: Request, res: Response) {
  const { value: body, error } = passwordChangeSchema.validate(req.body);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const { oldPassword, newPassword } = body;
  await changeUserPassword(req.user.id, oldPassword, newPassword);

  res.status(StatusCodes.OK).json({ message: "success" });
}

export async function deleteProfile(req: Request, res: Response) {
  res.send("delete profile");
}

export async function getUsers(req: Request, res: Response) {
  const { value: queryParams, error } =
    paginationQueryParamSchemaWithKeyword.validate(req.query);

  if (error) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid query parameter");
  }

  const { page, limit, order, keyword } = queryParams;

  const users = await _getUsers(page, limit, order, keyword);

  res.status(StatusCodes.OK).json(users);
}

export async function getUserById(req: Request, res: Response) {
  const user = await _getUserById(req.params.userId);
  res.status(StatusCodes.OK).json(user);
}
