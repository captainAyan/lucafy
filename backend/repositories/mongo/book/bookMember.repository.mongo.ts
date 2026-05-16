import { Types } from "mongoose";
import type { ClientSession } from "mongoose";

import type { BookMemberRole } from "../../../constants/policies.js";
import type PaginationOptions from "../../../types/paginationOptions.js";
import type BookMember from "../../../domain/book/bookMember/bookMember.domain.js";
import type BookMemberRepository from "../../../domain/book/bookMember/bookMember.repository.js";
import { mapBookMemberDocumentToDomain } from "../../../mappers/book/bookMember.mapper.js";
import bookMemberModel from "../../../models/mongo/bookMember.model.js";
import type { BookMemberDocument } from "../../../models/mongo/bookMember.model.js";
import { getSkip, getSortOrder } from "../../../utilities/paginationHelper.js";

export default class MongoBookMemberRepository implements BookMemberRepository {
  async addMember(
    bookId: string,
    memberData: {
      userId: string;
      role: BookMemberRole;
    },
    session: ClientSession | null = null,
  ): Promise<BookMember> {
    const [doc]: BookMemberDocument[] = await bookMemberModel.create(
      [
        {
          user: Types.ObjectId.createFromHexString(memberData.userId),
          book: Types.ObjectId.createFromHexString(bookId),
          role: memberData.role,
        },
      ],
      { session },
    );

    return mapBookMemberDocumentToDomain(doc);
  }

  async addMembers(
    membersData: { userId: string; role: BookMemberRole }[],
    bookId: string,
  ): Promise<BookMember[]> {
    if (membersData.length === 0) return [];

    const docs = membersData.map((memberData) => ({
      user: Types.ObjectId.createFromHexString(memberData.userId),
      book: Types.ObjectId.createFromHexString(bookId),
      role: memberData.role,
    }));

    // unordered -> continues on duplicates
    const result = await bookMemberModel.insertMany(docs, {
      ordered: false,
    });

    return result.map((doc) => mapBookMemberDocumentToDomain(doc));
  }

  async removeMember(userId: string, bookId: string): Promise<boolean> {
    const res = await bookMemberModel.deleteOne({
      user: userId,
      book: bookId,
    });

    return res.deletedCount === 1;
  }

  async removeMembers(userIds: string[], bookId: string): Promise<boolean> {
    if (userIds.length === 0) return true;

    const res = await bookMemberModel.deleteMany({
      user: { $in: userIds },
      book: bookId,
    });

    return res.deletedCount > 0;
  }

  async removeByBookId(bookId: string): Promise<boolean> {
    const res = await bookMemberModel.deleteMany({
      book: bookId,
    });

    return res.deletedCount > 0;
  }

  async removeByUserId(userId: string): Promise<boolean> {
    const res = await bookMemberModel.deleteMany({
      user: userId,
    });

    return res.deletedCount > 0;
  }

  async updateMember(
    userId: string,
    bookId: string,
    memberData: {
      role: BookMemberRole;
    },
  ): Promise<BookMember | null> {
    const doc = await bookMemberModel.findOneAndUpdate(
      {
        user: Types.ObjectId.createFromHexString(userId),
        book: Types.ObjectId.createFromHexString(bookId),
      },
      { $set: { role: memberData.role } },
      { new: true },
    );

    if (!doc) return null;

    return mapBookMemberDocumentToDomain(doc as BookMemberDocument);
  }

  async isMember(userId: string, bookId: string): Promise<boolean> {
    const exists = await bookMemberModel.exists({
      user: userId,
      book: bookId,
    });

    return !!exists;
  }

  async getBookIdsByUser(userId: string): Promise<string[]> {
    const docs = await bookMemberModel
      .find({ user: userId })
      .select("book")
      .lean();

    return docs.map((d) => d.book.toString());
  }

  async getUserIdsByBook(bookId: string): Promise<string[]> {
    const docs = await bookMemberModel
      .find({ book: bookId })
      .select("user")
      .lean();

    return docs.map((d) => d.user.toString());
  }

  async getBookIdsByUserPaginated(
    userId: string,
    options: PaginationOptions,
  ): Promise<string[]> {
    const { page, limit, order } = options;
    const skip = getSkip(page, limit);
    const sortOrder = getSortOrder(order);

    const docs = await bookMemberModel
      .find({ user: userId })
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .select("book")
      .lean();

    return docs.map((d) => d.book.toString());
  }

  async getUserIdsByBookPaginated(
    bookId: string,
    options: PaginationOptions,
  ): Promise<string[]> {
    const { page, limit, order } = options;
    const skip = getSkip(page, limit);
    const sortOrder = getSortOrder(order);

    const docs = await bookMemberModel
      .find({ book: bookId })
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .select("user")
      .lean();

    return docs.map((d) => d.user.toString());
  }

  async getMembersByBookPaginated(
    bookId: string,
    options: PaginationOptions,
  ): Promise<BookMember[]> {
    const { page, limit, order } = options;
    const skip = getSkip(page, limit);
    const sortOrder = getSortOrder(order);

    const docs = await bookMemberModel
      .find({ book: bookId })
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean();

    return docs.map((d) =>
      mapBookMemberDocumentToDomain(d as BookMemberDocument),
    );
  }

  async getMembersByBook(bookId: string): Promise<BookMember[]> {
    const docs: BookMemberDocument[] = await bookMemberModel
      .find({ book: bookId })
      .lean();

    return docs.map((d) => mapBookMemberDocumentToDomain(d));
  }

  async findByUserAndBook(
    userId: string,
    bookId: string,
  ): Promise<BookMember | null> {
    const doc = await bookMemberModel
      .findOne({
        user: Types.ObjectId.createFromHexString(userId),
        book: Types.ObjectId.createFromHexString(bookId),
      })
      .lean();

    if (!doc) return null;

    return mapBookMemberDocumentToDomain(doc as BookMemberDocument);
  }

  async countMembers(bookId: string): Promise<number> {
    return bookMemberModel.countDocuments({ book: bookId });
  }

  async countBooks(userId: string): Promise<number> {
    return bookMemberModel.countDocuments({ user: userId });
  }
}
