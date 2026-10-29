import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler } from "express";
import { ApplicationError, type ApplicationErrorCode } from "../../application/auth/errors";

const STATUS_BY_CODE: Record<ApplicationErrorCode, number> = {
  VALIDATION: 400,
  INVALID_CREDENTIALS: 401,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  EMAIL_ALREADY_REGISTERED: 409,
  CONFLICT: 409,
};

export function createErrorHandler(): ErrorRequestHandler {
  return (error, _request, response, _next) => {
    if (response.headersSent) {
      return;
    }

    if (error instanceof ApplicationError) {
      response.status(STATUS_BY_CODE[error.code]).json({ message: error.message });
      return;
    }

    if (isJsonSyntaxError(error)) {
      response.status(400).json({ message: "El JSON enviado no es válido." });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`Prisma ${error.code}`);

      if (error.code === "P2002") {
        response.status(409).json({ message: "El registro entra en conflicto con uno existente." });
        return;
      }

      if (error.code === "P2003") {
        response.status(409).json({ message: "El registro está relacionado con otros datos." });
        return;
      }

      if (error.code === "P2025") {
        response.status(404).json({ message: "El recurso no existe." });
        return;
      }

      response.status(500).json({ message: "Error interno del servidor." });
      return;
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Prisma validation");
      response.status(400).json({ message: "Los datos enviados no son válidos." });
      return;
    }

    console.error(error instanceof Error ? error.name : "UnknownError");
    response.status(500).json({ message: "Error interno del servidor." });
  };
}

function isJsonSyntaxError(error: unknown): boolean {
  if (!(error instanceof SyntaxError)) {
    return false;
  }

  if (!("status" in error) || typeof error.status !== "number") {
    return false;
  }

  return error.status === 400;
}
