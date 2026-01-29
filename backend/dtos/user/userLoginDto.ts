import type { z } from "zod";

import type { userLoginSchema } from "../../utilities/validation/userSchema.js";

type UserLoginDto = z.infer<typeof userLoginSchema>;

export default UserLoginDto;
