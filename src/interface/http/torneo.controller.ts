import type { NextFunction, Request, Response } from "express";
import type {
  CreateTorneo,
  DeleteTorneo,
  GetTorneo,
  ListTorneos,
  UpdateTorneo,
} from "../../application/torneos/ports";
import { parseCreateTorneoBody, parseTorneoId, parseUpdateTorneoBody } from "../../domain/torneo-input";
import { parseTorneoListQuery } from "./parse-torneo-query";

export function createListTorneosController(listTorneos: ListTorneos) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const parsed = parseTorneoListQuery(request.query);

    if (!parsed.ok) {
      response.status(400).json({ message: parsed.message });
      return;
    }

    try {
      const result = await listTorneos(parsed.value);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

export function createGetTorneoController(getTorneo: GetTorneo) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const id = parseTorneoId(readParam(request.params.id));

    if (!id.ok) {
      response.status(400).json({ message: id.message });
      return;
    }

    try {
      const torneo = await getTorneo(id.value);
      response.status(200).json(torneo);
    } catch (error) {
      next(error);
    }
  };
}

export function createCreateTorneoController(createTorneo: CreateTorneo) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const parsed = parseCreateTorneoBody(request.body);

    if (!parsed.ok) {
      response.status(400).json({ message: parsed.message });
      return;
    }

    try {
      const torneo = await createTorneo(parsed.value);
      response.status(201).json(torneo);
    } catch (error) {
      next(error);
    }
  };
}

export function createUpdateTorneoController(updateTorneo: UpdateTorneo) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const id = parseTorneoId(readParam(request.params.id));

    if (!id.ok) {
      response.status(400).json({ message: id.message });
      return;
    }

    const parsed = parseUpdateTorneoBody(request.body);

    if (!parsed.ok) {
      response.status(400).json({ message: parsed.message });
      return;
    }

    try {
      const torneo = await updateTorneo(id.value, parsed.value);
      response.status(200).json(torneo);
    } catch (error) {
      next(error);
    }
  };
}

export function createDeleteTorneoController(deleteTorneo: DeleteTorneo) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const id = parseTorneoId(readParam(request.params.id));

    if (!id.ok) {
      response.status(400).json({ message: id.message });
      return;
    }

    try {
      await deleteTorneo(id.value);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

function readParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
