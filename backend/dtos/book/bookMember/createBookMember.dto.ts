import type z from "zod";

import type { createBookMemberSchema } from "../../../validators/book/bookMember.schema.js";

type CreateBookMemberDto = z.infer<typeof createBookMemberSchema>;
export default CreateBookMemberDto;
