import { Router } from "express";

import {
  login,
  register,
  changePassword,
} from "../../controllers/userController.js";
import protect from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.put("/change-password", protect, changePassword);

export default router;
