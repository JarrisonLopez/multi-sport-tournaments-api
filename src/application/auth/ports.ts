import type { LoginInput, RegisterInput } from "../../domain/auth-input";
import type { AuthIdentity, User } from "../../domain/user";
import type { Role } from "../../domain/role";

export type UserCredentials = {
  id: string;
  role: Role;
  passwordHash: string;
};

export type CreateUserRecord = {
  nombre: string;
  email: string;
  passwordHash: string;
  role: Role;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findCredentialsByEmail(email: string): Promise<UserCredentials | null>;
  create(input: CreateUserRecord): Promise<User>;
}

export interface PasswordHasher {
  readonly placeholderHash: string;
  hash(plainText: string): Promise<string>;
  compare(plainText: string, passwordHash: string): Promise<boolean>;
}

export interface TokenService {
  sign(identity: AuthIdentity): string;
  verify(token: string): AuthIdentity;
}

export type RegisterUserDependencies = {
  users: UserRepository;
  hasher: PasswordHasher;
};

export type LoginUserDependencies = {
  users: UserRepository;
  hasher: PasswordHasher;
  tokens: TokenService;
};

export type LoginResult = {
  token: string;
  user: User;
};

export type RegisterUser = (input: RegisterInput) => Promise<User>;
export type LoginUser = (input: LoginInput) => Promise<LoginResult>;
