import type { PaginationLimit, UserGender } from "../../constants/policies.js";
import { PaginationSortOrder } from "../../constants/policies.js";
import type User from "../../domain/user/user.domain.js";
import type UserRepository from "../../domain/user/user.repository.js";
import type UserCredentials from "../../domain/user/userCredentials.domain.js";
import {
  mapUserDocumentsToUserDomainObjects,
  mapUserDocumentToUserCredentialsDomainObject,
  mapUserDocumentToUserDomainObject,
} from "../../mappers/user.mapper.js";
import type { UserDocument } from "../../models/mongo/user.model.js";
import userModel from "../../models/mongo/user.model.js";

export default class MongoUserRepository implements UserRepository {
  async create(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User | null> {
    const user: UserDocument = await userModel.create(userData);
    return mapUserDocumentToUserDomainObject(user);
  }

  async findById(id: string): Promise<User | null> {
    const user: UserDocument | null = await userModel.findById(id, "-password");
    if (!user) return null;
    return mapUserDocumentToUserDomainObject(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user: UserDocument | null = await userModel.findOne({ email });
    if (!user) return null;
    return mapUserDocumentToUserDomainObject(user);
  }

  async findAll({
    page = 0,
    limit,
    order,
    keyword = "",
  }: {
    page: number;
    limit: PaginationLimit;
    order: PaginationSortOrder;
    keyword: string;
  }): Promise<User[]> {
    const sortOrder =
      order === PaginationSortOrder.OLDEST_FIRST ? "createdAt" : "-createdAt";

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

    const users: UserDocument[] = await userModel
      .find(query)
      .sort(sortOrder)
      .skip(page * limit)
      .limit(limit);

    return mapUserDocumentsToUserDomainObjects(users);
  }

  async count(keyword?: string): Promise<number> {
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

    return userModel.countDocuments(query);
  }

  async updateById(
    id: string,
    data: Partial<{
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      bio: string;
      organization: string;
      jobTitle: string;
      address: string;
      dateOfBirth: Date;
      gender: UserGender;
    }>,
  ): Promise<User | null> {
    const user: UserDocument | null = await userModel.findById(id);
    if (!user) return null;

    Object.assign(user, data);
    const updatedUser: UserDocument = await user.save();
    return mapUserDocumentToUserDomainObject(updatedUser);
  }

  async updatePassword(id: string, passwordHash: string): Promise<User | null> {
    const user: UserDocument | null = await userModel.findById(id);
    if (!user) return null;

    user.password = passwordHash;
    const updatedUser: UserDocument = await user.save();
    return mapUserDocumentToUserDomainObject(updatedUser);
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const user: UserDocument | null = await userModel.findOne({ email });
    if (!user) return null;
    return mapUserDocumentToUserCredentialsDomainObject(user);
  }

  async findCredentialsById(id: string): Promise<UserCredentials | null> {
    const user: UserDocument | null = await userModel.findById(id);
    if (!user) return null;
    return mapUserDocumentToUserCredentialsDomainObject(user);
  }
}
