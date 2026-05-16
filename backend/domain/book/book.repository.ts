import type { ClientSession } from "mongoose";

import type { CurrencyCode } from "../../constants/currencyCodes.js";
import type Book from "./book.domain.js";
import type PaginationOptions from "../../types/paginationOptions.js";

export default interface BookRepository {
  create(
    bookData: {
      organization: string;
      address: string;
      currencyCode: CurrencyCode;
    },
    session: ClientSession | null,
  ): Promise<Book | null>;

  findById(bookId: string): Promise<Book | null>;
  findByIds(bookIds: string[]): Promise<Book[]>;
  findByIdForUser(bookId: string, userId: string): Promise<Book | null>;

  findAllPaginated(options: PaginationOptions): Promise<Book[]>;

  count(): Promise<number>;

  updateById(
    bookId: string,
    data: Partial<{
      organization: string;
      address: string;
      currency: CurrencyCode;
    }>,
  ): Promise<Book | null>;

  exists(bookId: string): Promise<boolean>;
}
