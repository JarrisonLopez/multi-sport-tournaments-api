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
  {
    id: "t-demo-copa-cali",
    nombre: "Copa Valle Nocturna",
    deporte: "Fútbol 7",
    estado: "abierto",
    cupoEquipos: 16,
    cupoJugadores: null,
    sedePrincipalId: "c-unidad-cali",
    sedeNombre: "Unidad Deportiva Panamericana",
    ciudad: "Cali",
    cierreInscripciones: "2026-12-15",
    descripcion:
      "Grupos y eliminatoria en grama sintética durante seis fines de semana. Cupo para dieciséis equipos del Valle.",
  },
  {
    id: "t-demo-costa-bquilla",
    nombre: "Costa Cup Barranquilla",
    deporte: "Fútbol 7",
    estado: "abierto",
    cupoEquipos: 12,
    cupoJugadores: null,
    sedePrincipalId: "c-cancha-sur",
    sedeNombre: "Cancha Sur Metropolitana",
    ciudad: "Barranquilla",
    cierreInscripciones: "2026-11-30",
    descripcion:
      "Torneo relámpago de fútbol 7 con jornadas al atardecer y eliminación directa desde octavos.",
  },
  {
    id: "t-demo-liga-bucara",
    nombre: "Liga Santander Indoor",
    deporte: "Baloncesto",
    estado: "abierto",
    cupoEquipos: 8,
    cupoJugadores: null,
    sedePrincipalId: "c-coliseo-santander",
    sedeNombre: "Coliseo Vicente Díaz",
    ciudad: "Bucaramanga",
    cierreInscripciones: "2027-01-20",
    descripcion:
      "Temporada corta de baloncesto bajo techo para clubes universitarios y equipos de barrio.",
  },
  {
    id: "t-demo-3x3-pereira",
    nombre: "Reto 3x3 Pereira",
    deporte: "Baloncesto",
    estado: "en_curso",
    cupoEquipos: 10,
    cupoJugadores: null,
    sedePrincipalId: "c-plaza-pereira",
    sedeNombre: "Plaza de Bolívar",
    ciudad: "Pereira",
    cierreInscripciones: "2026-10-10",
    descripcion:
      "Circuito de cancha corta ya en juego. Los encuentros siguen en la plaza central cada noche.",
  },
  {
    id: "t-demo-arena-cartagena",
    nombre: "Arena Caribe Cartagena",
    deporte: "Voleibol",
    estado: "abierto",
    cupoEquipos: 12,
    cupoJugadores: null,
    sedePrincipalId: "c-playa-bocagrande",
    sedeNombre: "Cancha Bocagrande",
    ciudad: "Cartagena",
    cierreInscripciones: "2026-12-01",
    descripcion:
      "Equipos de playa con jornadas de mañana. Categorías libre y mixta sobre arena.",
  },
  {
    id: "t-demo-red-manizales",
    nombre: "Red de Altura Manizales",
    deporte: "Voleibol",
    estado: "proximo",
    cupoEquipos: 8,
    cupoJugadores: null,
    sedePrincipalId: "c-coliseo-manizales",
    sedeNombre: "Coliseo Mayor",
    ciudad: "Manizales",
    cierreInscripciones: "2027-02-28",
    descripcion:
      "Torneo cubierto anunciado para el primer semestre. Las inscripciones todavía no están abiertas.",
  },
  {
    id: "t-demo-open-santa-marta",
    nombre: "Open Raqueta Santa Marta",
    deporte: "Tenis",
    estado: "abierto",
    cupoEquipos: null,
    cupoJugadores: 24,
    sedePrincipalId: "c-club-samarios",
    sedeNombre: "Club Samarios",
    ciudad: "Santa Marta",
    cierreInscripciones: "2026-11-20",
    descripcion:
      "Cuadro individual en polvo de ladrillo junto al mar. Hasta veinticuatro jugadores en primera ronda.",
  },
  {
    id: "t-demo-dobles-pasto",
    nombre: "Dobles de Altura Pasto",
    deporte: "Tenis",
    estado: "proximo",
    cupoEquipos: 16,
    cupoJugadores: null,
    sedePrincipalId: "c-club-narino",
    sedeNombre: "Club Nariño",
    ciudad: "Pasto",
    cierreInscripciones: "2027-03-15",
    descripcion:
      "Parejas de dobles en cancha dura. El cuadro se publica cuando el torneo pase a abierto.",
  },
  {
    id: "t-demo-criterio-ibague",
    nombre: "Criterio Ibagué",
    deporte: "Ciclismo",
    estado: "abierto",
    cupoEquipos: null,
    cupoJugadores: 40,
    sedePrincipalId: "c-velodromo-musica",
    sedeNombre: "Velódromo La Música",
    ciudad: "Ibagué",
    cierreInscripciones: "2026-12-20",
    descripcion:
      "Contrarreloj individual y fondo en circuito urbano. Cupo para cuarenta ciclistas aficionados.",
  },
  {
    id: "t-demo-pista-neiva",
    nombre: "Pista del Magdalena",
    deporte: "Atletismo",
    estado: "en_curso",
    cupoEquipos: null,
    cupoJugadores: 60,
    sedePrincipalId: "c-estadio-plazas",
    sedeNombre: "Estadio Guillermo Plazas",
    ciudad: "Neiva",
    cierreInscripciones: "2026-09-01",
    descripcion:
      "Jornadas de velocidad y medio fondo ya iniciadas en la pista del estadio. No recibe nuevas solicitudes.",
  },
  {
    id: "t-demo-aguas-monteria",
    nombre: "Aguas del Sinú",
    deporte: "Natación",
    estado: "proximo",
    cupoEquipos: null,
    cupoJugadores: 48,
    sedePrincipalId: "c-piscina-sinu",
    sedeNombre: "Piscina Olímpica del Sinú",
    ciudad: "Montería",
    cierreInscripciones: "2027-01-31",
    descripcion:
      "Encuentro de velocidad en piscina de cincuenta metros. El calendario se confirma antes de abrir cupos.",
  },
  {
    id: "t-demo-diamante-villavo",
    nombre: "Diamante del Llano",
    deporte: "Béisbol",
    estado: "en_curso",
    cupoEquipos: 6,
    cupoJugadores: null,
    sedePrincipalId: "c-diamante-catama",
    sedeNombre: "Diamante de Catama",
    ciudad: "Villavicencio",
    cierreInscripciones: "2026-08-30",
    descripcion:
      "Serie local de béisbol entre equipos del Llano. La fase regular ya está en juego.",
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
        console.log(`Torneo ${torneo.id} ya existe. No se modifica.`);
        continue;
      }

      console.log(`Torneo ${torneo.id} creado.`);

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
