import { Router } from "express";

import protect from "../../middlewares/authMiddleware.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", protect, profileRoutes);
router.use("/user", protect, userRoutes);
// router.use("/book", protect, require("./book/index"));

export default router;
