import { Router } from "express";
import type { AuthModule } from "../../infrastructure/auth/create-auth-module";
import type { InscripcionModule } from "../../infrastructure/inscripciones/create-inscripcion-module";
import { createAuthenticate } from "./authenticate";
import {
  createCreateInscripcionController,
  createListInscripcionesController,
  createListMisInscripcionesController,
} from "./inscripcion.controller";
import { requireAdmin } from "./require-admin";

export function createInscripcionRouter(inscripciones: InscripcionModule, auth: AuthModule): Router {
  const router = Router();
  const authenticate = createAuthenticate(auth.tokenService);

  router.post("/", authenticate, createCreateInscripcionController(inscripciones.createInscripcion));
  router.get("/mias", authenticate, createListMisInscripcionesController(inscripciones.listMisInscripciones));
  router.get("/", authenticate, requireAdmin, createListInscripcionesController(inscripciones.listInscripciones));

  return router;
}
