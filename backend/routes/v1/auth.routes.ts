import { Router } from "express";

import {
  login,
  register,
  changePassword,
} from "../../controllers/user.controller.js";
import protect from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.put("/change-password", protect, changePassword);

export default router;
