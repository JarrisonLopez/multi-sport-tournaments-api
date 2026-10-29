import express, { type Express } from "express";
import { getAuthModule } from "./infrastructure/auth/create-auth-module";
import { getInscripcionModule } from "./infrastructure/inscripciones/create-inscripcion-module";
import { getTorneoModule } from "./infrastructure/torneos/create-torneo-module";
import { createAuthRouter } from "./interface/http/auth.routes";
import { createErrorHandler } from "./interface/http/error-handler";
import { healthRouter } from "./interface/http/health.routes";
import { createInscripcionRouter } from "./interface/http/inscripcion.routes";
import { createTorneoRouter } from "./interface/http/torneo.routes";

export function createApp(): Express {
  const app = express();
  const auth = getAuthModule();

  app.use(express.json());
  app.use(healthRouter);
  app.use("/api/auth", createAuthRouter(auth));
  app.use("/api/torneos", createTorneoRouter(getTorneoModule(), auth));
  app.use("/api/inscripciones", createInscripcionRouter(getInscripcionModule(), auth));
  app.use(createErrorHandler());

  return app;
}
