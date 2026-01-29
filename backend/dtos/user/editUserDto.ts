import type { z } from "zod";

import type { editUserSchema } from "../../utilities/validation/userSchema.js";

type EditUserDto = z.infer<typeof editUserSchema>;

export default EditUserDto;
