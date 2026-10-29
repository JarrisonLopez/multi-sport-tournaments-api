import type { EstadoTorneo } from "../../domain/estado-torneo";
import type { Inscripcion } from "../../domain/inscripcion";
import type { CreateInscripcionInput } from "../../domain/inscripcion-input";

export type TorneoParaInscripcion = {
  id: string;
  estado: EstadoTorneo;
  cierreInscripciones: string;
};

export type CreateInscripcionRecord = CreateInscripcionInput & {
  userId: string;
};

export interface InscripcionRepository {
  findTorneo(id: string): Promise<TorneoParaInscripcion | null>;
  create(input: CreateInscripcionRecord): Promise<Inscripcion>;
  listByUser(userId: string): Promise<Inscripcion[]>;
  listAll(): Promise<Inscripcion[]>;
}

export type CreateInscripcion = (userId: string, input: CreateInscripcionInput) => Promise<Inscripcion>;
export type ListMisInscripciones = (userId: string) => Promise<Inscripcion[]>;
export type ListInscripciones = () => Promise<Inscripcion[]>;
