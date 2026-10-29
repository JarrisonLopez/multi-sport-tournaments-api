import type { EstadoTorneo } from "./estado-torneo";

export function fechaUtcHoy(now: Date = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function torneoAdmiteInscripcion(estado: EstadoTorneo, cierreInscripciones: string, hoy: string): boolean {
  return estado === "abierto" && cierreInscripciones >= hoy;
}
