import type { z } from "zod";

import type { createUserSchema } from "../../utilities/validation/userSchema.js";

type CreateUserDto = z.infer<typeof createUserSchema>;

export default CreateUserDto;
