import { parseLoginBody, type LoginInput } from "../../domain/auth-input";
import { ApplicationError, InvalidCredentialsError } from "./errors";
import type { LoginResult, LoginUserDependencies } from "./ports";

export async function loginUser(
  dependencies: LoginUserDependencies,
  input: LoginInput,
): Promise<LoginResult> {
  const parsed = parseLoginBody(input);

  if (!parsed.ok) {
    throw new ApplicationError(parsed.message, "VALIDATION");
  }

  const credentials = await dependencies.users.findCredentialsByEmail(parsed.value.email);
  const passwordHash = credentials?.passwordHash ?? dependencies.hasher.placeholderHash;
  const passwordMatches = await dependencies.hasher.compare(parsed.value.password, passwordHash);

  if (!credentials || !passwordMatches) {
    throw new InvalidCredentialsError();
  }

  const user = await dependencies.users.findById(credentials.id);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  return {
    token: dependencies.tokens.sign({ id: user.id, role: user.role }),
    user,
  };
}
