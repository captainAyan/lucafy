import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

import type CreateUserDto from "../dtos/user/createUser.dto.js";
import type EditUserDto from "../dtos/user/editUser.dto.js";
import tokenGenerator from "../utilities/tokenGenerator.js";
import type UserLoginDto from "../dtos/user/userLogin.dto.js";
import type UserRepository from "../domain/user/user.repository.js";
import type User from "../domain/user/user.domain.js";
import type UserCredentials from "../domain/user/userCredentials.domain.js";
import type PaginationOptions from "../types/paginationOptions.js";
import type AuthenticationResultDto from "../dtos/user/authenticationResult.dto.js";
import type PaginatedUsersResultDto from "../dtos/user/paginatedUsersResult.dto.js";

export default class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const userEmailVerification: User | null = await this.userRepo.findByEmail(
      userData.email,
    );
    if (userEmailVerification) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "User already exists");
    }

    const { password } = userData;

    const salt = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);

    let user: User | null;
    user = await this.userRepo.create({ ...userData, password: hash });

    if (!user) {
      throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid input error");
    }

    return user;
  }

  async registerUser(
    userData: CreateUserDto,
  ): Promise<AuthenticationResultDto> {
    await this.createUser(userData);
    return await this.authenticateUser({
      email: userData.email,
      password: userData.password,
    });
  }

  async getUserById(id: string): Promise<User> {
    const user: User | null = await this.userRepo.findById(id);
    if (!user) throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    return user;
  }

  async getUsersPaginated(
    keyword: string,
    paginationOptions: PaginationOptions,
  ): Promise<PaginatedUsersResultDto> {
    const users: User[] = await this.userRepo.findAllPaginated(
      keyword,
      paginationOptions,
    );

    const total: number = await this.userRepo.count(keyword);

    return { ...paginationOptions, total, users };
  }

  async editUserById(id: string, userData: EditUserDto): Promise<User> {
    const user: User | null = await this.userRepo.updateById(id, userData);
    if (!user) throw createHttpError(StatusCodes.NOT_FOUND, "User not found");
    return user;
  }

  async authenticateUser(
    loginData: UserLoginDto,
  ): Promise<AuthenticationResultDto> {
    const userCredentials: UserCredentials | null =
      await this.userRepo.findCredentialsByEmail(loginData.email);
    if (!userCredentials)
      throw createHttpError(
        StatusCodes.BAD_REQUEST,
        "Invalid email or password",
      );

    const isMatch = await bcrypt.compare(
      loginData.password,
      userCredentials.password,
    );
    if (!isMatch) {
      throw createHttpError(
        StatusCodes.UNAUTHORIZED,
        "Invalid email or password",
      );
    }

    return {
      user: userCredentials.user,
      token: tokenGenerator({ id: userCredentials.user.id }),
    };
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const userCredentials: UserCredentials | null =
      await this.userRepo.findCredentialsById(id);
    if (!userCredentials)
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");

    const isMatch = await bcrypt.compare(oldPassword, userCredentials.password);
    if (!isMatch) {
      throw createHttpError(StatusCodes.UNAUTHORIZED, "Invalid password");
    }

    const salt: string = await bcrypt.genSalt(10);
    const newPasswordHash: string = await bcrypt.hash(newPassword, salt);

    const updatedUser: User | null = await this.userRepo.updatePassword(
      id,
      newPasswordHash,
    );
    if (!updatedUser)
      throw createHttpError(StatusCodes.NOT_FOUND, "User not found");

    return userCredentials.user;
  }
}
