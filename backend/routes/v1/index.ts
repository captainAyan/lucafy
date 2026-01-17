import { Router } from "express";

import protect from "../../middlewares/authMiddleware.js";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", protect, profileRoutes);
router.use("/user", protect, userRoutes);
// router.use("/book", protect, require("./book/index"));

export default router;
