import { Router } from "express";

import protect from "../../middlewares/auth.middleware.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import userRoutes from "./user.routes.js";
import bookRoutes from "./book/index.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", protect, profileRoutes);
router.use("/user", protect, userRoutes);
router.use("/book", protect, bookRoutes);

export default router;
