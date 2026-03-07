import { Router } from "express";

import {
  getProfile,
  editProfile,
  deleteProfile,
} from "../../controllers/user.controller.js";

const router = Router();

router.get("/", getProfile);
router.put("/", editProfile);
router.delete("/", deleteProfile);

export default router;
