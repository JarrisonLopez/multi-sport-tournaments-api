-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "estado_torneo" AS ENUM ('abierto', 'en_curso', 'proximo');

-- CreateEnum
CREATE TYPE "disponibilidad_inscripcion" AS ENUM ('fines-de-semana', 'noches', 'mananas', 'flexible');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "user_role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "torneos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "deporte" TEXT NOT NULL,
    "estado" "estado_torneo" NOT NULL,
    "cupoEquipos" INTEGER,
    "cupoJugadores" INTEGER,
    "sedePrincipalId" TEXT NOT NULL,
    "sedeNombre" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "cierreInscripciones" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "torneos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "torneoId" TEXT NOT NULL,
    "disponibilidad" "disponibilidad_inscripcion" NOT NULL,
    "mensaje" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_userId_torneoId_key" ON "inscripciones"("userId", "torneoId");

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_torneoId_fkey" FOREIGN KEY ("torneoId") REFERENCES "torneos"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Exactly one positive quota, and the other column must stay null.
ALTER TABLE "torneos" ADD CONSTRAINT "torneos_cupo_exactamente_uno_positivo" CHECK (
    (
        "cupoEquipos" IS NOT NULL
        AND "cupoEquipos" > 0
        AND "cupoJugadores" IS NULL
    )
    OR
    (
        "cupoJugadores" IS NOT NULL
        AND "cupoJugadores" > 0
        AND "cupoEquipos" IS NULL
    )
);
