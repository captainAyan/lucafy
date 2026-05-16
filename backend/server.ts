import process from "process";
import console from "console";
import { fileURLToPath } from "url";
import path from "path";

import type { Application, Request, Response, NextFunction } from "express";
import express from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import createHttpError from "http-errors";
import dotenv from "dotenv";

import errorHandler from "./middlewares/error.middleware.js";
import { PER_MINUTE_REQUEST_LIMIT } from "./constants/policies.js";
import apiRoutes from "./routes/api.js";

dotenv.config();

const node_env: string = process.env.NODE_ENV!;
const port: number = Number(process.env.PORT) || 5000;
const db: string = process.env.MONGODB_URI!;

const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());

mongoose
  .connect(db)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit with failure
  });

// Graceful shutdown on SIGINT (e.g., Ctrl+C)
process.on("SIGINT", () => {
  mongoose.connection
    .close()
    .then(() => {
      console.log("🛑 MongoDB disconnected on app termination");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during disconnection:", err);
      process.exit(1);
    });
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  limit: node_env === "production" ? PER_MINUTE_REQUEST_LIMIT : Infinity,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req: Request, _res: Response, _next: NextFunction) => {
    throw createHttpError(StatusCodes.TOO_MANY_REQUESTS, "Too many requests");
  },
});
app.use(limiter); // limits all paths

app.use("/api", apiRoutes);

// Serve frontend
if (node_env === "production") {
  app.use(express.static(path.join(dirname, "../frontend/build")));

  app.get("/{*any}", (_req: Request, res: Response) =>
    res.sendFile(
      path.resolve(dirname, "../", "frontend", "build", "index.html"),
    ),
  );
} else {
  app.get("/", (_req: Request, res: Response) =>
    res.send("Please set to production"),
  );
}

app.use("/{*any}", (_req: Request, _res: Response, _next: NextFunction) => {
  throw createHttpError(StatusCodes.NOT_FOUND, "Not found");
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
