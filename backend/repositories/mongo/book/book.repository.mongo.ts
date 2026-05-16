import type { ClientSession } from "mongoose";
import { Types } from "mongoose";

import type { CurrencyCode } from "../../../constants/currencyCodes.js";
import type Book from "../../../domain/book/book.domain.js";
import type BookRepository from "../../../domain/book/book.repository.js";
import type { BookDocument } from "../../../models/mongo/book.model.js";
import bookModel from "../../../models/mongo/book.model.js";
import { mapBookDocumentToBookDomainObject } from "../../../mappers/book/book.mapper.js";
import type PaginationOptions from "../../../types/paginationOptions.js";
import { getSkip, getSortOrder } from "../../../utilities/paginationHelper.js";

export default class MongoBookRepository implements BookRepository {
  async create(
    bookData: {
      organization: string;
      address: string;
      currencyCode: CurrencyCode;
    },
    session: ClientSession | null = null,
  ): Promise<Book | null> {
    const options: { session?: ClientSession } = session ? { session } : {};
    const result: BookDocument[] = await bookModel.create([bookData], options);
    const book: BookDocument | undefined = result[0];

    if (!book) return null;
    return mapBookDocumentToBookDomainObject(book);
  }

  async findById(bookId: string): Promise<Book | null> {
    if (!Types.ObjectId.isValid(bookId)) return null;

    const book: BookDocument | null = await bookModel.findById(bookId).lean();
    if (!book) return null;

    return mapBookDocumentToBookDomainObject(book);
  }

  async findByIds(bookIds: string[]): Promise<Book[]> {
    const validIds = bookIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (validIds.length === 0) return [];

    const books: BookDocument[] = await bookModel
      .find({ _id: { $in: validIds } })
      .lean();

    return books.map((book) => mapBookDocumentToBookDomainObject(book));
  }

  async findByIdForUser(bookId: string, userId: string): Promise<Book | null> {
    const result = await bookModel.aggregate([
      { $match: { _id: new Types.ObjectId(bookId) } },
      {
        $lookup: {
          from: "bookmembers",
          let: { bookId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$bookId", "$$bookId"] },
                    { $eq: ["$userId", new Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "membership",
        },
      },
      { $match: { membership: { $ne: [] } } },
    ]);

    return result[0] ?? null;
  }

  async findAllPaginated(options: PaginationOptions): Promise<Book[]> {
    const { page, limit, order } = options;
    const skip = getSkip(page, limit);
    const sortOrder = getSortOrder(order);

    const books: BookDocument[] = await bookModel
      .find()
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean();

    return books.map((book) => mapBookDocumentToBookDomainObject(book));
  }

  async updateById(
    bookId: string,
    data: Partial<{
      organization: string;
      address: string;
      currency: CurrencyCode;
    }>,
  ): Promise<Book | null> {
    if (!Types.ObjectId.isValid(bookId)) return null;

    const updated: BookDocument | null = await bookModel
      .findByIdAndUpdate(bookId, data, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!updated) return null;

    return mapBookDocumentToBookDomainObject(updated);
  }

  async count(): Promise<number> {
    return bookModel.countDocuments();
  }

  async exists(bookId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(bookId)) return false;

    const result = await bookModel.exists({ _id: bookId });
    return !!result;
  }
}
