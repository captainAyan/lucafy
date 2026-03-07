import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

import { userService as containerUserService } from "../container.js";
import type UserService from "../services/user.service.js";
import type {
  AuthenticationResult,
  PaginatedUsersResult,
} from "../services/user.service.js";
import {
  createUserSchema,
  editUserSchema,
  passwordChangeSchema,
  userLoginSchema,
} from "../validators/user.schema.js";
import { paginationQueryParamSchemaWithKeyword } from "../validators/paginationQueryParam.schema.js";
import type CreateUserDto from "../dtos/user/createUser.dto.js";
import type UserLoginDto from "../dtos/user/userLogin.dto.js";
import type AuthenticationResponseDto from "../dtos/user/authenticationResponse.dto.js";
import type EditUserDto from "../dtos/user/editUser.dto.js";
import type UserResponseDto from "../dtos/user/userResponse.dto.js";
import type PaginatedUsersResponseDto from "../dtos/user/paginatedUsersResponse.dto.js";
import type AuthenticatedRequest from "../types/authenticatedRequest.js";
import {
  mapAuthenticationResultToAuthenticationResponseDto,
  mapPaginatedUserResultToPaginatedUsersResponseDto,
  mapUserDomainObjectToUserResponseDto,
} from "../mappers/user.mapper.js";
import type User from "../domain/user/user.domain.js";

const userService: UserService = containerUserService;

export async function login(req: Request, res: Response) {
  const result = userLoginSchema.safeParse(req.body);
  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const loginData: UserLoginDto = result.data;

  const authResult: AuthenticationResult =
    await userService.authenticateUser(loginData);

  const response: AuthenticationResponseDto =
    mapAuthenticationResultToAuthenticationResponseDto(authResult);

  res.status(StatusCodes.OK).json(response);
}

export async function register(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const data: CreateUserDto = result.data;

  const authResult: AuthenticationResult = await userService.registerUser(data);

  const response: AuthenticationResponseDto =
    mapAuthenticationResultToAuthenticationResponseDto(authResult);

  res.status(StatusCodes.CREATED).json(response);
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const profile: User = await userService.getUserById(req.user.id);

  const response: UserResponseDto =
    mapUserDomainObjectToUserResponseDto(profile);
  res.status(StatusCodes.OK).json(response);
}

export async function editProfile(req: AuthenticatedRequest, res: Response) {
  const result = editUserSchema.safeParse(req.body);
  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const data: EditUserDto = result.data;
  const profile: User = await userService.editUserById(req.user.id, data);

  const response: UserResponseDto =
    mapUserDomainObjectToUserResponseDto(profile);

  res.status(StatusCodes.OK).json(response);
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const result = passwordChangeSchema.safeParse(req.body);

  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
  }

  const { oldPassword, newPassword } = result.data;

  await userService.changePassword(req.user.id, oldPassword, newPassword);

  res.status(StatusCodes.OK).json({ message: "success" });
}

export function deleteProfile(req: AuthenticatedRequest, res: Response) {
  res.send("delete profile");
}

export async function getUsers(req: AuthenticatedRequest, res: Response) {
  const result = paginationQueryParamSchemaWithKeyword.safeParse(req.query);

  if (!result.success) {
    throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid query parameter");
  }

  const { page, limit, order, keyword } = result.data;

  const usersPaginatedResponse: PaginatedUsersResult =
    await userService.getUsers(page, limit, order, keyword ?? "");

  const response: PaginatedUsersResponseDto =
    mapPaginatedUserResultToPaginatedUsersResponseDto(usersPaginatedResponse);

  res.status(StatusCodes.OK).json(response);
}

export async function getUserById(req: AuthenticatedRequest, res: Response) {
  const user: User = await userService.getUserById(req.params.userId);
  const response = mapUserDomainObjectToUserResponseDto(user);
  res.status(StatusCodes.OK).json(response);
}
