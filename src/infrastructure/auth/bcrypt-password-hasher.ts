import bcrypt from "bcrypt";
import type { PasswordHasher } from "../../application/auth/ports";

const HASH_ROUNDS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  readonly placeholderHash = bcrypt.hashSync("timing-equalization", HASH_ROUNDS);

  hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, HASH_ROUNDS);
  }

  compare(plainText: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainText, passwordHash);
  }
}
