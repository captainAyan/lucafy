import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import {
  createUser as _createUser,
  getUserById as _getUserById,
  getUserByEmail,
  getUsers as _getUsers,
  getTotal,
  editUserById as _editUserById,
} from "./userDao.js";
import mapUserToDto, {
  mapEntityToAuthenticationDto,
  mapPaginatedUsers,
} from "../../mappers/user.js";
import type CreateUserDto from "../../dtos/user/createUserDto.js";
import type UserResponseDto from "../../dtos/user/userResponseDto.js";
import type PaginatedUsersDto from "../../dtos/user/paginatedUsers.js";
import type { UserDocument } from "../../models/userModel.js";
import type { SortOrder } from "../../constants/policies.js";
import type EditUserDto from "../../dtos/user/editUserDto.js";
import type AuthenticationResponseDto from "../../dtos/user/authenticationResponseDto.js";
import tokenGenerator from "../../utilities/tokenGenerator.js";
import type UserLoginDto from "../../dtos/user/userLoginDto.js";

/**
 * Creates a new user and stores it in the database.
 *
 * @param {CreateUserDto} userData - New user data.
 * @returns {Promise<UserResponseDto>} The created user.
 */
export async function createUser(
  userData: CreateUserDto,
): Promise<UserResponseDto> {
  const { password } = userData;

  const salt = await bcrypt.genSalt(10);
  const hash: string = await bcrypt.hash(password, salt);

  let user: UserDocument | null;
  try {
    user = await _createUser({ ...userData, password: hash });
  } catch (err: unknown) {
    if (err.code === 11000) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "User already exists");
    }
    throw err;
  }

  if (!user)
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");

  return mapUserToDto(user);
}

/**
 * Get user using id
 *
 * @param {string} id - mongodb id of user
 * @returns {Promise<UserResponseDto>} the user
 */
export async function getUserById(id: string): Promise<UserResponseDto> {
  const user: UserDocument | null = await _getUserById(id);
  if (!user) throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
  return mapUserToDto(user);
}

export async function getUsers(
  page: number,
  limit: number,
  order: SortOrder,
  keyword: string,
): Promise<PaginatedUsersDto> {
  const users: Array<UserDocument> = await _getUsers(
    page,
    limit,
    order,
    keyword,
  );

  const total: number = await getTotal(keyword);
  const skip = limit * page;
  return mapPaginatedUsers(page, skip, total, limit, order, users);
}

export async function editUserById(
  id: string,
  userData: EditUserDto,
): Promise<UserResponseDto> {
  const user: UserDocument | null = await _editUserById(id, userData);
  if (!user) throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
  return mapUserToDto(user);
}

export async function authenticateUser(
  loginData: UserLoginDto,
): Promise<AuthenticationResponseDto> {
  const user: UserDocument | null = await getUserByEmail(loginData.email);
  if (!user)
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid email or password");

  const isMatch = await bcrypt.compare(loginData.password, user.password);
  if (!isMatch) {
    throw createHttpError(
      StatusCodes.UNAUTHORIZED,
      "Invalid email or password",
    );
  }

  return mapEntityToAuthenticationDto(
    user,
    tokenGenerator({ id: user._id as string }),
  );
}
