import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../application/auth/errors";
import type { CreateInscripcion, ListInscripciones, ListMisInscripciones } from "../../application/inscripciones/ports";
import { parseCreateInscripcionBody } from "../../domain/inscripcion-input";

export function createCreateInscripcionController(createInscripcion: CreateInscripcion) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const userId = request.authUser?.id;

    if (userId === undefined) {
      next(new UnauthorizedError());
      return;
    }

    const parsed = parseCreateInscripcionBody(request.body);

    if (!parsed.ok) {
      response.status(400).json({ message: parsed.message });
      return;
    }

    try {
      const inscripcion = await createInscripcion(userId, parsed.value);
      response.status(201).json(toJson(inscripcion));
    } catch (error) {
      next(error);
    }
  };
}

export function createListMisInscripcionesController(listMisInscripciones: ListMisInscripciones) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const userId = request.authUser?.id;

    if (userId === undefined) {
      next(new UnauthorizedError());
      return;
    }

    try {
      const inscripciones = await listMisInscripciones(userId);
      response.status(200).json({ data: inscripciones.map(toJson) });
    } catch (error) {
      next(error);
    }
  };
}

export function createListInscripcionesController(listInscripciones: ListInscripciones) {
  return async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const inscripciones = await listInscripciones();
      response.status(200).json({ data: inscripciones.map(toJson) });
    } catch (error) {
      next(error);
    }
  };
}

function toJson(inscripcion: {
  id: string;
  userId: string;
  torneoId: string;
  disponibilidad: string;
  mensaje: string;
  createdAt: Date;
}): {
  id: string;
  userId: string;
  torneoId: string;
  disponibilidad: string;
  mensaje: string;
  createdAt: string;
} {
  return {
    id: inscripcion.id,
    userId: inscripcion.userId,
    torneoId: inscripcion.torneoId,
    disponibilidad: inscripcion.disponibilidad,
    mensaje: inscripcion.mensaje,
    createdAt: inscripcion.createdAt.toISOString(),
  };
}
