import type { PaginatedTorneos, Torneo, TorneoDraft } from "../../domain/torneo";
import { TorneoAlreadyExistsError, TorneoHasInscripcionesError, TorneoNotFoundError } from "./errors";
import type { ListTorneosQuery, TorneoRepository } from "./ports";

export async function listTorneos(
  torneos: TorneoRepository,
  query: ListTorneosQuery,
): Promise<PaginatedTorneos> {
  const page = await torneos.list(query);

  return {
    pagination: {
      total: page.total,
      page: query.page,
      limit: query.limit,
      totalPages: page.total === 0 ? 0 : Math.ceil(page.total / query.limit),
    },
    data: page.items,
  };
}

export async function getTorneo(torneos: TorneoRepository, id: string): Promise<Torneo> {
  const torneo = await torneos.findById(id);

  if (!torneo) {
    throw new TorneoNotFoundError();
  }

  return torneo;
}

export async function createTorneo(torneos: TorneoRepository, torneo: Torneo): Promise<Torneo> {
  const existing = await torneos.findById(torneo.id);

  if (existing) {
    throw new TorneoAlreadyExistsError();
  }

  return torneos.create(torneo);
}

export async function updateTorneo(
  torneos: TorneoRepository,
  id: string,
  draft: TorneoDraft,
): Promise<Torneo> {
  const existing = await torneos.findById(id);

  if (!existing) {
    throw new TorneoNotFoundError();
  }

  return torneos.update(id, draft);
}

export async function deleteTorneo(torneos: TorneoRepository, id: string): Promise<void> {
  const existing = await torneos.findById(id);

  if (!existing) {
    throw new TorneoNotFoundError();
  }

  const inscripciones = await torneos.countInscripciones(id);

  if (inscripciones > 0) {
    throw new TorneoHasInscripcionesError();
  }

  await torneos.delete(id);
}
