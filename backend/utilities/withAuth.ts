import type { Request, Response } from "express";

import type AuthenticatedRequest from "../types/authenticatedRequest.js";

type ControllerMethod = (
  req: AuthenticatedRequest,
  res: Response,
) => Promise<void>;

type RouterMethod = (req: Request, res: Response) => Promise<void>;

export function withAuth(controllerMethod: ControllerMethod): RouterMethod {
  /*
  return function (req, res) {
    if (!req.user) {
      throw createHttpError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    return controllerMethod(req as AuthenticatedRequest, res);
  };
  */

  return function (req, res) {
    return controllerMethod(req as AuthenticatedRequest, res);
  };
}
