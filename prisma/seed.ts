import "dotenv/config";
import bcrypt from "bcrypt";
import type { EstadoTorneo } from "@prisma/client";
import { createPrismaClient } from "../src/infrastructure/database/prisma-client";

type TorneoSeed = {
  id: string;
  nombre: string;
  deporte: string;
  estado: EstadoTorneo;
  cupoEquipos: number | null;
  cupoJugadores: number | null;
  sedePrincipalId: string;
  sedeNombre: string;
  ciudad: string;
  cierreInscripciones: string;
  descripcion: string;
};

const torneos: TorneoSeed[] = [
  {
    id: "t-copa-metro",
    nombre: "Copa Metropolitana Indoor",
    deporte: "Fútbol 7",
    estado: "abierto",
    cupoEquipos: 12,
    cupoJugadores: null,
    sedePrincipalId: "c-complejo-norte",
    sedeNombre: "Complejo Deportivo Norte",
    ciudad: "Medellín",
    cierreInscripciones: "2026-09-28",
    descripcion:
      "Fase de grupos y eliminación directa durante cuatro fines de semana. Inscripciones hasta el 28 de septiembre.",
  },
  {
    id: "t-liga-3x3",
    nombre: "Liga Universitaria 3x3",
    deporte: "Baloncesto",
    estado: "en_curso",
    cupoEquipos: 8,
    cupoJugadores: null,
    sedePrincipalId: "c-coliseo-alma",
    sedeNombre: "Coliseo Alma Máter",
    ciudad: "Envigado",
    cierreInscripciones: "2026-08-15",
    descripcion:
      "Formato rápido de cancha corta con jornadas nocturnas entre campus. Ideal para equipos mixtos.",
  },
  {
    id: "t-open-arena",
    nombre: "Open de Arena Costa",
    deporte: "Voleibol",
    estado: "proximo",
    cupoEquipos: 10,
    cupoJugadores: null,
    sedePrincipalId: "c-arena-pacifico",
    sedeNombre: "Cancha Arena Pacífico",
    ciudad: "Buenaventura",
    cierreInscripciones: "2026-10-05",
    descripcion:
      "Torneo de playa con categorías libre y universitaria. Partidos al aire libre con cupos limitados.",
  },
  {
    id: "t-challenger-ciudad",
    nombre: "Challenger Individual Ciudad",
    deporte: "Tenis",
    estado: "abierto",
    cupoEquipos: null,
    cupoJugadores: 32,
    sedePrincipalId: "c-club-raqueta",
    sedeNombre: "Club Raqueta Centro",
    ciudad: "Bogotá",
    cierreInscripciones: "2026-09-20",
    descripcion:
      "Cuadro individual masculino y femenino con ranking interno. Canchas de polvo de ladrillo.",
  },
];

type SeedAccount = {
  nombre: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
};

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (value === undefined || value.trim() === "") {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }

  return value;
}

const seedAccountEnvNames = [
  "SEED_ADMIN_NOMBRE",
  "SEED_ADMIN_EMAIL",
  "SEED_ADMIN_PASSWORD",
  "SEED_USER_NOMBRE",
  "SEED_USER_EMAIL",
  "SEED_USER_PASSWORD",
] as const;

function readSeedAccounts(): SeedAccount[] {
  const missing = seedAccountEnvNames.filter((name) => {
    const value = process.env[name];
    return value === undefined || value.trim() === "";
  });

  if (missing.length > 0) {
    console.log(
      `Cuentas demo pendientes. Faltan: ${missing.join(", ")}. Se cargan solo los torneos.`,
    );
    return [];
  }

  return [
    {
      nombre: requiredEnv("SEED_ADMIN_NOMBRE"),
      email: requiredEnv("SEED_ADMIN_EMAIL"),
      password: requiredEnv("SEED_ADMIN_PASSWORD"),
      role: "ADMIN",
    },
    {
      nombre: requiredEnv("SEED_USER_NOMBRE"),
      email: requiredEnv("SEED_USER_EMAIL"),
      password: requiredEnv("SEED_USER_PASSWORD"),
      role: "USER",
    },
  ];
}

function calendarDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    const accounts = readSeedAccounts();

    for (const account of accounts) {
      const email = account.email.trim().toLowerCase();
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existing) {
        console.log(`Cuenta demo ${account.role} ya existe. No se modifica la contraseña.`);
        continue;
      }

      const password = await bcrypt.hash(account.password, 10);

      await prisma.user.create({
        data: {
          nombre: account.nombre.trim(),
          email,
          password,
          role: account.role,
        },
      });
    }

    for (const torneo of torneos) {
      const existing = await prisma.torneo.findUnique({
        where: { id: torneo.id },
        select: { id: true },
      });

      if (existing) {
        continue;
      }

      await prisma.torneo.create({
        data: {
          id: torneo.id,
          nombre: torneo.nombre,
          deporte: torneo.deporte,
          estado: torneo.estado,
          cupoEquipos: torneo.cupoEquipos,
          cupoJugadores: torneo.cupoJugadores,
          sedePrincipalId: torneo.sedePrincipalId,
          sedeNombre: torneo.sedeNombre,
          ciudad: torneo.ciudad,
          cierreInscripciones: calendarDate(torneo.cierreInscripciones),
          descripcion: torneo.descripcion,
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido al sembrar datos.";
  console.error(message);
  process.exitCode = 1;
});
