import { Router } from "express";

import { getUsers, getUserById } from "../../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);

export default router;
