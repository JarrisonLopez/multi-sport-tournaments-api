import type { PaginatedTorneos, Torneo, TorneoDraft } from "../../domain/torneo";

export type ListTorneosQuery = {
  page: number;
  limit: number;
};

export type TorneoPage = {
  total: number;
  items: Torneo[];
};

export interface TorneoRepository {
  list(query: ListTorneosQuery): Promise<TorneoPage>;
  findById(id: string): Promise<Torneo | null>;
  create(torneo: Torneo): Promise<Torneo>;
  update(id: string, draft: TorneoDraft): Promise<Torneo>;
  countInscripciones(id: string): Promise<number>;
  delete(id: string): Promise<void>;
}

export type ListTorneos = (query: ListTorneosQuery) => Promise<PaginatedTorneos>;
export type GetTorneo = (id: string) => Promise<Torneo>;
export type CreateTorneo = (torneo: Torneo) => Promise<Torneo>;
export type UpdateTorneo = (id: string, draft: TorneoDraft) => Promise<Torneo>;
export type DeleteTorneo = (id: string) => Promise<void>;
