import type { NextFunction, Request, Response } from "express";

const ALLOWED_ORIGIN = "http://localhost:3010";

export function localFrontendCors(request: Request, response: Response, next: NextFunction): void {
  if (request.headers.origin === ALLOWED_ORIGIN) {
    response.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type");
  }

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
}
