import type { z } from "zod";

import type { editUserSchema } from "../../validators/user.schema.js";

type EditUserDto = z.infer<typeof editUserSchema>;

export default EditUserDto;
