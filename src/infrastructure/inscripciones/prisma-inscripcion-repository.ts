import { Prisma, type PrismaClient } from "@prisma/client";
import { InscripcionDuplicadaError } from "../../application/inscripciones/errors";
import type {
  CreateInscripcionRecord,
  InscripcionRepository,
  TorneoParaInscripcion,
} from "../../application/inscripciones/ports";
import type { Disponibilidad } from "../../domain/disponibilidad";
import type { Inscripcion } from "../../domain/inscripcion";

const inscriptionSelect = {
  id: true,
  userId: true,
  torneoId: true,
  disponibilidad: true,
  mensaje: true,
  createdAt: true,
} as const;

const inscriptionOrder = [{ createdAt: "asc" as const }, { id: "asc" as const }];

export class PrismaInscripcionRepository implements InscripcionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findTorneo(id: string): Promise<TorneoParaInscripcion | null> {
    const torneo = await this.prisma.torneo.findUnique({
      where: { id },
      select: {
        id: true,
        estado: true,
        cierreInscripciones: true,
      },
    });

    if (torneo === null) {
      return null;
    }

    return {
      id: torneo.id,
      estado: torneo.estado,
      cierreInscripciones: formatUtcDate(torneo.cierreInscripciones),
    };
  }

  async create(input: CreateInscripcionRecord): Promise<Inscripcion> {
    try {
      const row = await this.prisma.inscripcion.create({
        data: {
          userId: input.userId,
          torneoId: input.torneoId,
          disponibilidad: toPrismaDisponibilidad(input.disponibilidad),
          mensaje: input.mensaje,
        },
        select: inscriptionSelect,
      });

      return toInscripcion(row);
    } catch (error) {
      if (isKnown(error) && error.code === "P2002") {
        throw new InscripcionDuplicadaError();
      }

      throw error;
    }
  }

  async listByUser(userId: string): Promise<Inscripcion[]> {
    const rows = await this.prisma.inscripcion.findMany({
      where: { userId },
      select: inscriptionSelect,
      orderBy: inscriptionOrder,
    });

    return rows.map(toInscripcion);
  }

  async listAll(): Promise<Inscripcion[]> {
    const rows = await this.prisma.inscripcion.findMany({
      select: inscriptionSelect,
      orderBy: inscriptionOrder,
    });

    return rows.map(toInscripcion);
  }
}

type InscripcionRow = {
  id: string;
  userId: string;
  torneoId: string;
  disponibilidad: "fines_de_semana" | "noches" | "mananas" | "flexible";
  mensaje: string;
  createdAt: Date;
};

function toInscripcion(row: InscripcionRow): Inscripcion {
  return {
    id: row.id,
    userId: row.userId,
    torneoId: row.torneoId,
    disponibilidad: fromPrismaDisponibilidad(row.disponibilidad),
    mensaje: row.mensaje,
    createdAt: row.createdAt,
  };
}

function toPrismaDisponibilidad(
  value: Disponibilidad,
): "fines_de_semana" | "noches" | "mananas" | "flexible" {
  if (value === "fines-de-semana") {
    return "fines_de_semana";
  }

  return value;
}

function fromPrismaDisponibilidad(
  value: "fines_de_semana" | "noches" | "mananas" | "flexible",
): Disponibilidad {
  if (value === "fines_de_semana") {
    return "fines-de-semana";
  }

  return value;
}

function formatUtcDate(value: Date): string {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isKnown(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}
