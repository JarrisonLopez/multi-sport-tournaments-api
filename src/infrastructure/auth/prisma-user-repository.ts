import { Prisma, type PrismaClient } from "@prisma/client";
import { EmailAlreadyRegisteredError } from "../../application/auth/errors";
import type { CreateUserRecord, UserCredentials, UserRepository } from "../../application/auth/ports";
import type { Role } from "../../domain/role";
import type { User } from "../../domain/user";

const publicUserSelect = {
  id: true,
  nombre: true,
  email: true,
  role: true,
} as const;

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: publicUserSelect,
    });

    return user === null ? null : toPublicUser(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });

    return user === null ? null : toPublicUser(user);
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        password: true,
      },
    });

    if (user === null) {
      return null;
    }

    return {
      id: user.id,
      role: user.role,
      passwordHash: user.password,
    };
  }

  async create(input: CreateUserRecord): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          nombre: input.nombre,
          email: input.email,
          password: input.passwordHash,
          role: input.role,
        },
        select: publicUserSelect,
      });

      return toPublicUser(user);
    } catch (error) {
      if (isEmailConflict(error)) {
        throw new EmailAlreadyRegisteredError();
      }

      throw error;
    }
  }
}

function toPublicUser(user: {
  id: string;
  nombre: string;
  email: string;
  role: Role;
}): User {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    role: user.role,
  };
}

function isEmailConflict(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return false;
  }

  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return target.some((field) => field === "email");
  }

  return typeof target === "string" && target.includes("email");
}
