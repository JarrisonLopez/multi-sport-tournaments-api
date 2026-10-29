import { Prisma, type PrismaClient } from "@prisma/client";
import { TorneoAlreadyExistsError, TorneoHasInscripcionesError, TorneoNotFoundError } from "../../application/torneos/errors";
import type { ListTorneosQuery, TorneoPage, TorneoRepository } from "../../application/torneos/ports";
import type { EstadoTorneo } from "../../domain/estado-torneo";
import type { Torneo, TorneoDraft } from "../../domain/torneo";
import { withId } from "../../domain/torneo-input";

const torneoOrder = [{ id: "asc" as const }];

export class PrismaTorneoRepository implements TorneoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async list(query: ListTorneosQuery): Promise<TorneoPage> {
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.torneo.count(),
      this.prisma.torneo.findMany({
        orderBy: torneoOrder,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    return {
      total,
      items: rows.map(toTorneo),
    };
  }

  async findById(id: string): Promise<Torneo | null> {
    const row = await this.prisma.torneo.findUnique({ where: { id } });
    return row === null ? null : toTorneo(row);
  }

  async create(torneo: Torneo): Promise<Torneo> {
    try {
      const row = await this.prisma.torneo.create({ data: toPersistence(torneo) });
      return toTorneo(row);
    } catch (error) {
      if (isKnown(error) && error.code === "P2002") {
        throw new TorneoAlreadyExistsError();
      }

      throw error;
    }
  }

  async update(id: string, draft: TorneoDraft): Promise<Torneo> {
    try {
      const row = await this.prisma.torneo.update({
        where: { id },
        data: toPersistence(withId(id, draft)),
      });
      return toTorneo(row);
    } catch (error) {
      if (isKnown(error) && error.code === "P2025") {
        throw new TorneoNotFoundError();
      }

      throw error;
    }
  }

  async countInscripciones(id: string): Promise<number> {
    return this.prisma.inscripcion.count({ where: { torneoId: id } });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.torneo.delete({ where: { id } });
    } catch (error) {
      if (!isKnown(error)) {
        throw error;
      }

      if (error.code === "P2025") {
        throw new TorneoNotFoundError();
      }

      if (error.code === "P2003") {
        throw new TorneoHasInscripcionesError();
      }

      throw error;
    }
  }
}

type TorneoRow = {
  id: string;
  nombre: string;
  deporte: string;
  estado: EstadoTorneo;
  cupoEquipos: number | null;
  cupoJugadores: number | null;
  sedePrincipalId: string;
  sedeNombre: string;
  ciudad: string;
  cierreInscripciones: Date;
  descripcion: string;
};

function toTorneo(row: TorneoRow): Torneo {
  const base = {
    id: row.id,
    nombre: row.nombre,
    deporte: row.deporte,
    estado: row.estado,
    sedePrincipalId: row.sedePrincipalId,
    sedeNombre: row.sedeNombre,
    ciudad: row.ciudad,
    cierreInscripciones: formatUtcDate(row.cierreInscripciones),
    descripcion: row.descripcion,
  };

  if (row.cupoEquipos !== null && row.cupoJugadores === null && row.cupoEquipos > 0) {
    return { ...base, cupoEquipos: row.cupoEquipos, cupoJugadores: null };
  }

  if (row.cupoJugadores !== null && row.cupoEquipos === null && row.cupoJugadores > 0) {
    return { ...base, cupoEquipos: null, cupoJugadores: row.cupoJugadores };
  }

  throw new Error("El torneo almacenado tiene cupos inconsistentes.");
}

function toPersistence(torneo: Torneo): {
  id: string;
  nombre: string;
  deporte: string;
  estado: EstadoTorneo;
  cupoEquipos: number | null;
  cupoJugadores: number | null;
  sedePrincipalId: string;
  sedeNombre: string;
  ciudad: string;
  cierreInscripciones: Date;
  descripcion: string;
} {
  return {
    id: torneo.id,
    nombre: torneo.nombre,
    deporte: torneo.deporte,
    estado: torneo.estado,
    cupoEquipos: torneo.cupoEquipos,
    cupoJugadores: torneo.cupoJugadores,
    sedePrincipalId: torneo.sedePrincipalId,
    sedeNombre: torneo.sedeNombre,
    ciudad: torneo.ciudad,
    cierreInscripciones: parseUtcDate(torneo.cierreInscripciones),
    descripcion: torneo.descripcion,
  };
}

function formatUtcDate(value: Date): string {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseUtcDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function isKnown(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}
