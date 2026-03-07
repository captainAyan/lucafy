import type {
  PaginationLimit,
  PaginationSortOrder,
} from "../../constants/policies.js";
import type User from "./user.domain.js";
import type UserCredentials from "./userCredentials.domain.js";

export default interface UserRepository {
  create(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User | null>;

  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;

  findAll(options: {
    page: number;
    limit: PaginationLimit;
    order: PaginationSortOrder;
    keyword: string;
  }): Promise<User[]>;

  count(keyword?: string): Promise<number>;

  updateById(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
    }>,
  ): Promise<User | null>;

  updatePassword(id: string, passwordHash: string): Promise<User | null>;

  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  findCredentialsById(id: string): Promise<UserCredentials | null>;
}
