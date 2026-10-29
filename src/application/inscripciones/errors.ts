import { ApplicationError } from "../auth/errors";

export class InscripcionDuplicadaError extends ApplicationError {
  constructor() {
    super("Ya tienes una inscripción en este torneo.", "CONFLICT");
  }
}

export class TorneoNoDisponibleError extends ApplicationError {
  constructor() {
    super("El torneo no admite inscripciones.", "CONFLICT");
  }
}
