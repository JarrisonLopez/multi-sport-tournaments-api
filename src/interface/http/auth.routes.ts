import { Router } from "express";
import type { AuthModule } from "../../infrastructure/auth/create-auth-module";
import { createLoginController, createRegisterController } from "./auth.controller";

export function createAuthRouter(auth: AuthModule): Router {
  const router = Router();

  router.post("/register", createRegisterController(auth.registerUser));
  router.post("/login", createLoginController(auth.loginUser));

  return router;
}
