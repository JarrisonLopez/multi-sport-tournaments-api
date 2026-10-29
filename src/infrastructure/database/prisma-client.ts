import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString === undefined || connectionString.trim() === "") {
    throw new Error("Falta la variable de entorno DATABASE_URL.");
  }

  const adapter = new PrismaPg(connectionString);

  return new PrismaClient({ adapter });
}
