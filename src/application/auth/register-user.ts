import { parseRegisterBody, type RegisterInput } from "../../domain/auth-input";
import type { User } from "../../domain/user";
import { ApplicationError, EmailAlreadyRegisteredError } from "./errors";
import type { RegisterUserDependencies } from "./ports";

export async function registerUser(
  dependencies: RegisterUserDependencies,
  input: RegisterInput,
): Promise<User> {
  const parsed = parseRegisterBody(input);

  if (!parsed.ok) {
    throw new ApplicationError(parsed.message, "VALIDATION");
  }

  const existing = await dependencies.users.findByEmail(parsed.value.email);

  if (existing) {
    throw new EmailAlreadyRegisteredError();
  }

  const passwordHash = await dependencies.hasher.hash(parsed.value.password);

  return dependencies.users.create({
    nombre: parsed.value.nombre,
    email: parsed.value.email,
    passwordHash,
    role: "USER",
  });
}
