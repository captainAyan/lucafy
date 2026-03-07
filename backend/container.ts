import process from "node:process";

import type UserRepository from "./domain/user/user.repository.js";
import MongoUserRepository from "./repositories/mongo/user.repository.mongo.js";
import UserService from "./services/user.service.js";

function createUserRepository(): UserRepository {
  const provider = process.env.DB_PROVIDER;

  switch (provider) {
    case "mongo":
      return new MongoUserRepository();

    // case "sql":
    //   return new SqlUserRepository();

    default:
      throw new Error("Invalid DB_PROVIDER");
  }
}

export const userRepository = createUserRepository();
export const userService = new UserService(userRepository);
