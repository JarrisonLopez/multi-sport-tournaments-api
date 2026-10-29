import type { NextFunction, Request, Response } from "express";

const LOCAL_DEV_ORIGIN = "http://localhost:3010";

function configuredFrontendOrigin(): string | null {
  const raw = process.env.FRONTEND_URL?.trim() ?? "";

  if (raw.length === 0 || raw.includes("*")) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  if (url.username !== "" || url.password !== "") {
    return null;
  }

  return url.origin;
}

export function assertCorsConfiguration(): void {
  if (process.env.NODE_ENV === "production" && configuredFrontendOrigin() === null) {
    throw new Error("En producción FRONTEND_URL debe ser el origen exacto del frontend, sin comodines.");
  }
}

function isAllowedOrigin(origin: string): boolean {
  if (process.env.NODE_ENV !== "production" && origin === LOCAL_DEV_ORIGIN) {
    return true;
  }

  const configured = configuredFrontendOrigin();
  return configured !== null && origin === configured;
}

export function frontendCors(request: Request, response: Response, next: NextFunction): void {
  const originHeader = request.headers.origin;
  const origin = typeof originHeader === "string" ? originHeader : null;

  if (origin !== null && isAllowedOrigin(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
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
