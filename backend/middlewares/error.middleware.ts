import console from "console";
import process from "process";

import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import type { HttpError } from "http-errors";
import { isHttpError } from "http-errors";

function logError(err: HttpError): void {
  console.error("MESSAGE:", err.message);
  console.error("NAME:", err.name);
  console.error(
    "STATUS CODE:",
    `${err.status || StatusCodes.INTERNAL_SERVER_ERROR}`,
  );
  console.error("STACK:", err.stack);
}

function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isProd = process.env.NODE_ENV! === "production";

  logError(err);

  const statusCode = isHttpError(err)
    ? err.status
    : StatusCodes.INTERNAL_SERVER_ERROR;

  const errorResponse = {
    error: {
      statusCode,
      message: err.message || "An unexpected error occurred",
      name: err.name || "Error",
      timestamp: new Date().toISOString(),
      stack: "",
    },
  };

  // if (err.details) {
  //   errorResponse.error.details = err.details; // optional custom field
  // }

  if (!isProd && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}

export default errorHandler;
