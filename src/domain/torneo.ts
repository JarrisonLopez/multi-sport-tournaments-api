import type { EstadoTorneo } from "./estado-torneo";

type CupoEquipos = {
  cupoEquipos: number;
  cupoJugadores: null;
};

type CupoJugadores = {
  cupoEquipos: null;
  cupoJugadores: number;
};

type TorneoBase = {
  nombre: string;
  deporte: string;
  estado: EstadoTorneo;
  sedePrincipalId: string;
  sedeNombre: string;
  ciudad: string;
  cierreInscripciones: string;
  descripcion: string;
};

export type TorneoDraft = TorneoBase & (CupoEquipos | CupoJugadores);

export type Torneo = TorneoDraft & {
  id: string;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedTorneos = {
  pagination: Pagination;
  data: Torneo[];
};
