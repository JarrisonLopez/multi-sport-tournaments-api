import { loginUser } from "../../application/auth/login-user";
import type { LoginUser, RegisterUser, TokenService } from "../../application/auth/ports";
import { registerUser } from "../../application/auth/register-user";
import { createPrismaClient } from "../database/prisma-client";
import { BcryptPasswordHasher } from "./bcrypt-password-hasher";
import { JwtTokenService } from "./jwt-token-service";
import { PrismaUserRepository } from "./prisma-user-repository";

export type AuthModule = {
  registerUser: RegisterUser;
  loginUser: LoginUser;
  tokenService: TokenService;
};

let authModule: AuthModule | null = null;

export function getAuthModule(): AuthModule {
  if (authModule) {
    return authModule;
  }

  const users = new PrismaUserRepository(createPrismaClient());
  const hasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(requiredEnv("JWT_SECRET"), requiredEnv("JWT_EXPIRES_IN"));

  authModule = {
    tokenService,
    registerUser: (input) => registerUser({ users, hasher }, input),
    loginUser: (input) => loginUser({ users, hasher, tokens: tokenService }, input),
  };

  return authModule;
}

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.trim() === "") {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }

  return value.trim();
}
