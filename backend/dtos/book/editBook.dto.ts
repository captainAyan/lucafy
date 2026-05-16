import type { z } from "zod";

import type { editBookSchema } from "../../validators/book/book.schema.js";

type EditBookDto = z.infer<typeof editBookSchema>;

export default EditBookDto;
