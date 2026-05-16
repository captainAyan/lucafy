// utils/zod-schemas.ts
import { z } from "zod";
import mongoose from "mongoose";

export const zObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid ID format");
