import type { Inscripcion } from "../../domain/inscripcion";
import type { CreateInscripcionInput } from "../../domain/inscripcion-input";
import { fechaUtcHoy, torneoAdmiteInscripcion } from "../../domain/inscripcion-rules";
import { TorneoNotFoundError } from "../torneos/errors";
import { InscripcionDuplicadaError, TorneoNoDisponibleError } from "./errors";
import type { InscripcionRepository } from "./ports";

export async function createInscripcion(
  inscripciones: InscripcionRepository,
  userId: string,
  input: CreateInscripcionInput,
  hoy: string = fechaUtcHoy(),
): Promise<Inscripcion> {
  const torneo = await inscripciones.findTorneo(input.torneoId);

  if (!torneo) {
    throw new TorneoNotFoundError();
  }

  if (!torneoAdmiteInscripcion(torneo.estado, torneo.cierreInscripciones, hoy)) {
    throw new TorneoNoDisponibleError();
  }

  return inscripciones.create({
    userId,
    torneoId: input.torneoId,
    disponibilidad: input.disponibilidad,
    mensaje: input.mensaje,
  });
}

export async function listMisInscripciones(
  inscripciones: InscripcionRepository,
  userId: string,
): Promise<Inscripcion[]> {
  return inscripciones.listByUser(userId);
}

export async function listInscripciones(inscripciones: InscripcionRepository): Promise<Inscripcion[]> {
  return inscripciones.listAll();
}
