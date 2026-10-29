import jwt, { type SignOptions } from "jsonwebtoken";
import type { TokenService } from "../../application/auth/ports";
import { ROLES, type Role } from "../../domain/role";
import type { AuthIdentity } from "../../domain/user";

export class JwtTokenService implements TokenService {
  private readonly expiresIn: NonNullable<SignOptions["expiresIn"]>;

  constructor(
    private readonly secret: string,
    expiresIn: string,
  ) {
    this.expiresIn = parseExpiresIn(expiresIn);
  }

  sign(identity: AuthIdentity): string {
    return jwt.sign({ id: identity.id, role: identity.role }, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verify(token: string): AuthIdentity {
    const decoded = jwt.verify(token, this.secret);

    if (typeof decoded === "string" || !isAuthPayload(decoded)) {
      throw new Error("El token no contiene una identidad válida.");
    }

    return {
      id: decoded.id,
      role: decoded.role,
    };
  }
}

function parseExpiresIn(value: string): NonNullable<SignOptions["expiresIn"]> {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  if (/^\d+[smhdw]$/.test(value)) {
    return value as NonNullable<SignOptions["expiresIn"]>;
  }

  throw new Error("JWT_EXPIRES_IN no tiene un formato de expiración válido.");
}

function isAuthPayload(value: object): value is { id: string; role: Role } {
  if (!("id" in value) || !("role" in value)) {
    return false;
  }

  const id = value.id;
  const role = value.role;

  return typeof id === "string" && id.trim() !== "" && isRole(role);
}

function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLES.some((role) => role === value);
}
