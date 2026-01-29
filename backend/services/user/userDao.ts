import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";

import User from "../../models/userModel.js";
import type { UserDocument } from "../../models/userModel.js";
import type CreateUserDto from "../../dtos/user/createUserDto.js";
import { SortOrder } from "../../constants/policies.js";
import type EditUserDto from "../../dtos/user/editUserDto.js";

export async function createUser(
  userData: CreateUserDto,
): Promise<UserDocument | null> {
  return await User.create(userData);
}

export async function getUserById(id: string): Promise<UserDocument | null> {
  return await User.findById(id, "-password");
}

export async function getUserByEmail(
  email: string,
): Promise<UserDocument | null> {
  return await User.findOne({ email });
}

export async function getUsers(
  page: number,
  limit: number,
  order: SortOrder,
  keyword: string,
): Promise<UserDocument[]> {
  const sortOrder =
    order === SortOrder.OLDEST_FIRST ? "createdAt" : "-createdAt";

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

  return await User.find(query)
    .sort(sortOrder)
    .skip(page * limit)
    .limit(limit);
}

export async function getTotal(keyword: string): Promise<number> {
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

  return await User.countDocuments(query);
}

export async function editUserById(
  id: string,
  userData: EditUserDto,
): Promise<UserDocument | null> {
  const user: UserDocument | null = await getUserById(id);
  if (!user) return null;

  Object.assign(user, userData);
  return user.save();
}

export async function changeUserPassword(
  id,
  oldPassword,
  newPassword,
): Promise<UserDocument | null> {
  const user = await User.findById(id).select("+password");
  if (!user) throw createHttpError(StatusCodes.NOT_FOUND, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw createHttpError(StatusCodes.UNAUTHORIZED, "Invalid password");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  return user.save();
}
