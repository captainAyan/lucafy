import type UserResponseDto from "../dtos/user/userResponseDto.js";
import type PaginatedUsersDto from "../dtos/user/paginatedUsers.js";
import type { UserDocument } from "../models/userModel.js";
import type { SortOrder } from "../constants/policies.js";
import type AuthenticationResponseDto from "../dtos/user/authenticationResponseDto.js";

export default function mapUserToDto(user: UserDocument): UserResponseDto {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    middleName: user.middleName || undefined,
    lastName: user.lastName,
    email: user.email,
    bio: user.bio || undefined,
    organization: user.organization || undefined,
    jobTitle: user.jobTitle || undefined,
    address: user.address || undefined,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
    gender: user.gender || undefined,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function mapEntityToAuthenticationDto(
  user: UserDocument,
  token: string,
): AuthenticationResponseDto {
  return {
    user: mapUserToDto(user),
    token,
  };
}

export function mapPaginatedUsers(
  page: number,
  skip: number,
  total: number,
  limit: number,
  order: SortOrder,
  users: Array<UserDocument>,
): PaginatedUsersDto {
  return {
    page: page,
    skip: skip,
    total: total,
    limit: limit,
    order: order,
    users: users.map(
      (user: UserDocument): UserResponseDto => mapUserToDto(user),
    ),
  };
}
