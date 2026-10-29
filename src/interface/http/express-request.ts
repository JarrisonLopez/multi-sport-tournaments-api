import type { AuthIdentity } from "../../domain/user";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthIdentity;
    }
  }
}

export {};
