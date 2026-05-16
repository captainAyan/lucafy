import process from "node:process";

import dotenv from "dotenv";

// user
import type UserRepository from "./domain/user/user.repository.js";
import UserService from "./services/user.service.js";
import MongoUserRepository from "./repositories/mongo/user.repository.mongo.js";

// book
import type BookRepository from "./domain/book/book.repository.js";
import BookService from "./services/book/book.service.js";
import MongoBookRepository from "./repositories/mongo/book/book.repository.mongo.js";

// bookmember
import type BookMemberRepository from "./domain/book/bookMember/bookMember.repository.js";
import MongoBookMemberRepository from "./repositories/mongo/book/bookMember.repository.mongo.js";
import BookMemberService from "./services/book/bookMember.service.js";

dotenv.config();

type DBProvider = "mongo" | "sql";

function getProvider(env: string | undefined): DBProvider {
  if (env === "mongo" || env === "sql") return env;
  throw new Error("Invalid DB_PROVIDER");
}

const provider = getProvider(process.env.DB_PROVIDER);

const registry = {
  user: {
    mongo: MongoUserRepository,
    // sql: SqlUserRepository,
  },
  book: {
    mongo: MongoBookRepository,
  },
  bookMember: {
    mongo: MongoBookMemberRepository,
  },
};

function resolve<T>(key: keyof typeof registry): T {
  const implimentations = registry[key];
  const Impl = implimentations[provider as keyof typeof implimentations];

  if (!Impl) {
    throw new Error(`Invalid provider for ${String(key)}`);
  }

  return new Impl() as T;
}

export const userRepository = resolve<UserRepository>("user");
export const bookRepository = resolve<BookRepository>("book");
export const bookMemberRepository = resolve<BookMemberRepository>("bookMember");

export const userService = new UserService(userRepository);
export const bookMemberService = new BookMemberService(
  bookMemberRepository,
  bookRepository,
  userRepository,
);
export const bookService = new BookService(bookRepository, bookMemberService);
