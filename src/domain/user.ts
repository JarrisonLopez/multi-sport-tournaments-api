import type { Role } from "./role";

export type User = {
  id: string;
  nombre: string;
  email: string;
  role: Role;
};

export type AuthIdentity = {
  id: string;
  role: Role;
};
