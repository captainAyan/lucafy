import type z from "zod";

import type { editBookMemberSchema } from "../../../validators/book/bookMember.schema.js";

type EditBookMemberDto = z.infer<typeof editBookMemberSchema>;
export default EditBookMemberDto;
