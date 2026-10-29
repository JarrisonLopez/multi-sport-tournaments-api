import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../application/auth/errors";
import type { TokenService } from "../../application/auth/ports";
import "./express-request";

const BEARER_PATTERN = /^Bearer\s+(\S+)$/i;

export function createAuthenticate(tokenService: TokenService) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const header = request.header("authorization");
    const match = header === undefined ? null : BEARER_PATTERN.exec(header.trim());

    if (match === null) {
      next(new UnauthorizedError());
      return;
    }

    try {
      request.authUser = tokenService.verify(match[1]);
      next();
    } catch {
      next(new UnauthorizedError());
    }
  };
}
