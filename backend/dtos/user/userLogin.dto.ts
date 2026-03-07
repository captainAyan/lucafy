import type { z } from "zod";

import type { userLoginSchema } from "../../validators/user.schema.js";

type UserLoginDto = z.infer<typeof userLoginSchema>;

export default UserLoginDto;
