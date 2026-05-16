import { z } from "zod";

import { BookMemberRole } from "../../constants/policies.js";
import { zObjectId } from "../../utilities/zodHelper.js";

export const createBookMemberSchema = z.object({
  userId: zObjectId,
  role: z.enum(BookMemberRole),
});

export const editBookMemberSchema = z.object({
  role: z.enum(BookMemberRole),
});
