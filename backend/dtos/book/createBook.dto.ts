import type { z } from "zod";

import type { createBookSchema } from "../../validators/book/book.schema.js";

type CreateBookDto = z.infer<typeof createBookSchema>;

export default CreateBookDto;
