export type ApplicationErrorCode =
  | "VALIDATION"
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_REGISTERED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT";

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;

  constructor(message: string, code: ApplicationErrorCode) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
  }
}

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super("Credenciales inválidas.", "INVALID_CREDENTIALS");
  }
}

export class EmailAlreadyRegisteredError extends ApplicationError {
  constructor() {
    super("El correo ya está registrado.", "EMAIL_ALREADY_REGISTERED");
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor() {
    super("Token inválido o expirado.", "UNAUTHORIZED");
  }
}

export class ForbiddenError extends ApplicationError {
  constructor() {
    super("No tienes permiso para realizar esta acción.", "FORBIDDEN");
  }
}
