import {
  createTorneo,
  deleteTorneo,
  getTorneo,
  listTorneos,
  updateTorneo,
} from "../../application/torneos/torneo-use-cases";
import type {
  CreateTorneo,
  DeleteTorneo,
  GetTorneo,
  ListTorneos,
  UpdateTorneo,
} from "../../application/torneos/ports";
import { createPrismaClient } from "../database/prisma-client";
import { PrismaTorneoRepository } from "./prisma-torneo-repository";

export type TorneoModule = {
  listTorneos: ListTorneos;
  getTorneo: GetTorneo;
  createTorneo: CreateTorneo;
  updateTorneo: UpdateTorneo;
  deleteTorneo: DeleteTorneo;
};

let torneoModule: TorneoModule | null = null;

export function getTorneoModule(): TorneoModule {
  if (torneoModule) {
    return torneoModule;
  }

  const torneos = new PrismaTorneoRepository(createPrismaClient());

  torneoModule = {
    listTorneos: (query) => listTorneos(torneos, query),
    getTorneo: (id) => getTorneo(torneos, id),
    createTorneo: (input) => createTorneo(torneos, input),
    updateTorneo: (id, draft) => updateTorneo(torneos, id, draft),
    deleteTorneo: (id) => deleteTorneo(torneos, id),
  };

  return torneoModule;
}
