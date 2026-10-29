import type { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../../application/auth/errors";
import "./express-request";

export function requireAdmin(request: Request, _response: Response, next: NextFunction): void {
  if (!request.authUser) {
    next(new UnauthorizedError());
    return;
  }

  if (request.authUser.role !== "ADMIN") {
    next(new ForbiddenError());
    return;
  }

  next();
}
