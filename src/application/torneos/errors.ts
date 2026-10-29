import { ApplicationError } from "../auth/errors";

export class TorneoNotFoundError extends ApplicationError {
  constructor() {
    super("El torneo no existe.", "NOT_FOUND");
  }
}

export class TorneoAlreadyExistsError extends ApplicationError {
  constructor() {
    super("Ya existe un torneo con ese identificador.", "CONFLICT");
  }
}

export class TorneoHasInscripcionesError extends ApplicationError {
  constructor() {
    super("No se puede eliminar un torneo con inscripciones.", "CONFLICT");
  }
}
