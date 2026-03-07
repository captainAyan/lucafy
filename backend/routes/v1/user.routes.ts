import { Router } from "express";

import { getUsers, getUserById } from "../../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);

export default router;
