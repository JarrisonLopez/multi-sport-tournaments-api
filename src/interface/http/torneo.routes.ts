import { Router } from "express";
import type { AuthModule } from "../../infrastructure/auth/create-auth-module";
import type { TorneoModule } from "../../infrastructure/torneos/create-torneo-module";
import { createAuthenticate } from "./authenticate";
import { requireAdmin } from "./require-admin";
import {
  createCreateTorneoController,
  createDeleteTorneoController,
  createGetTorneoController,
  createListTorneosController,
  createUpdateTorneoController,
} from "./torneo.controller";

export function createTorneoRouter(torneos: TorneoModule, auth: AuthModule): Router {
  const router = Router();
  const authenticate = createAuthenticate(auth.tokenService);

  router.get("/", createListTorneosController(torneos.listTorneos));
  router.get("/:id", createGetTorneoController(torneos.getTorneo));
  router.post("/", authenticate, requireAdmin, createCreateTorneoController(torneos.createTorneo));
  router.put("/:id", authenticate, requireAdmin, createUpdateTorneoController(torneos.updateTorneo));
  router.delete("/:id", authenticate, requireAdmin, createDeleteTorneoController(torneos.deleteTorneo));

  return router;
}
