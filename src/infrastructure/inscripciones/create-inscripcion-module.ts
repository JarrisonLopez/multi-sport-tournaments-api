import {
  createInscripcion,
  listInscripciones,
  listMisInscripciones,
} from "../../application/inscripciones/inscripcion-use-cases";
import type {
  CreateInscripcion,
  ListInscripciones,
  ListMisInscripciones,
} from "../../application/inscripciones/ports";
import { createPrismaClient } from "../database/prisma-client";
import { PrismaInscripcionRepository } from "./prisma-inscripcion-repository";

export type InscripcionModule = {
  createInscripcion: CreateInscripcion;
  listMisInscripciones: ListMisInscripciones;
  listInscripciones: ListInscripciones;
};

let inscripcionModule: InscripcionModule | null = null;

export function getInscripcionModule(): InscripcionModule {
  if (inscripcionModule) {
    return inscripcionModule;
  }

  const inscripciones = new PrismaInscripcionRepository(createPrismaClient());

  inscripcionModule = {
    createInscripcion: (userId, input) => createInscripcion(inscripciones, userId, input),
    listMisInscripciones: (userId) => listMisInscripciones(inscripciones, userId),
    listInscripciones: () => listInscripciones(inscripciones),
  };

  return inscripcionModule;
}
