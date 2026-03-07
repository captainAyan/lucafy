import type UserResponseDto from "../dtos/user/userResponse.dto.js";
import type PaginatedUsersResponseDto from "../dtos/user/paginatedUsersResponse.dto.js";
import type { UserDocument } from "../models/mongo/user.model.js";
import type AuthenticationResponseDto from "../dtos/user/authenticationResponse.dto.js";
import type User from "../domain/user/user.domain.js";
import type UserCredentials from "../domain/user/userCredentials.domain.js";
import type {
  AuthenticationResult,
  PaginatedUsersResult,
} from "../services/user.service.js";

export function mapUserDomainObjectToUserResponseDto(
  user: User,
): UserResponseDto {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
    bio: user.bio,
    organization: user.organization,
    jobTitle: user.jobTitle,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
  };
}

export function mapAuthenticationResultToAuthenticationResponseDto(
  authenticationResult: AuthenticationResult,
): AuthenticationResponseDto {
  return {
    user: mapUserDomainObjectToUserResponseDto(authenticationResult.user),
    token: authenticationResult.token,
  };
}

export function mapPaginatedUserResultToPaginatedUsersResponseDto(
  result: PaginatedUsersResult,
): PaginatedUsersResponseDto {
  return {
    page: result.page,
    skip: result.page * result.limit,
    total: result.total,
    limit: result.limit,
    order: result.order,
    users: result.users.map(
      (user: User): UserResponseDto =>
        mapUserDomainObjectToUserResponseDto(user),
    ),
  };
}

export function mapUserDocumentToUserDomainObject(userDoc: UserDocument): User {
  return {
    id: userDoc._id.toString(),
    firstName: userDoc.firstName,
    middleName: userDoc.middleName,
    lastName: userDoc.lastName,
    email: userDoc.email,
    bio: userDoc.bio,
    organization: userDoc.organization,
    jobTitle: userDoc.jobTitle,
    address: userDoc.address,
    dateOfBirth: userDoc.dateOfBirth,
    gender: userDoc.gender,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
}

export function mapUserDocumentsToUserDomainObjects(
  userDocs: UserDocument[],
): User[] {
  return userDocs.map(
    (userDoc: UserDocument): User => mapUserDocumentToUserDomainObject(userDoc),
  );
}

export function mapUserDocumentToUserCredentialsDomainObject(
  userDoc: UserDocument,
): UserCredentials {
  return {
    user: mapUserDocumentToUserDomainObject(userDoc),
    password: userDoc.password,
  };
}
