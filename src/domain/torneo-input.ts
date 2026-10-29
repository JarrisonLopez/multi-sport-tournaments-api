import { ESTADOS_TORNEO, type EstadoTorneo } from "./estado-torneo";
import type { Torneo, TorneoDraft } from "./torneo";


export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s'.-]*$/u;
const PLACE_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;

const CREATE_FIELDS = [
  "id",
  "nombre",
  "deporte",
  "estado",
  "cupoEquipos",
  "cupoJugadores",
  "sedePrincipalId",
  "sedeNombre",
  "ciudad",
  "cierreInscripciones",
  "descripcion",
] as const;

const UPDATE_FIELDS = CREATE_FIELDS.filter((field) => field !== "id");

export function parseTorneoId(value: unknown): ParseResult<string> {
  if (typeof value !== "string") {
    return failure("El identificador del torneo es obligatorio.");
  }

  const id = value.trim();

  if (id.length < 2 || id.length > 40 || !ID_PATTERN.test(id)) {
    return failure("El identificador del torneo no es válido.");
  }

  return { ok: true, value: id };
}

export function parseCreateTorneoBody(body: unknown): ParseResult<Torneo> {
  if (!isRecord(body)) {
    return failure("El cuerpo de la petición debe ser un objeto JSON.");
  }

  const unknown = unknownField(body, CREATE_FIELDS);
  if (unknown) {
    return failure("El cuerpo contiene campos no permitidos.");
  }

  const id = parseTorneoId(body.id);
  if (!id.ok) {
    return id;
  }

  const draft = parseDraft(body);
  if (!draft.ok) {
    return draft;
  }

  return { ok: true, value: withId(id.value, draft.value) };
}

export function parseUpdateTorneoBody(body: unknown): ParseResult<TorneoDraft> {
  if (!isRecord(body)) {
    return failure("El cuerpo de la petición debe ser un objeto JSON.");
  }

  if ("id" in body) {
    return failure("El identificador se toma de la ruta y no del cuerpo.");
  }

  const unknown = unknownField(body, UPDATE_FIELDS);
  if (unknown) {
    return failure("El cuerpo contiene campos no permitidos.");
  }

  return parseDraft(body);
}

function parseDraft(body: Record<string, unknown>): ParseResult<TorneoDraft> {
  const nombre = readText(body.nombre, "El nombre", 2, 80, NAME_PATTERN);
  if (!nombre.ok) {
    return nombre;
  }

  const deporte = readText(body.deporte, "El deporte", 2, 40, NAME_PATTERN);
  if (!deporte.ok) {
    return deporte;
  }

  const estado = readEstado(body.estado);
  if (!estado.ok) {
    return estado;
  }

  const cupo = readCupo(body.cupoEquipos, body.cupoJugadores);
  if (!cupo.ok) {
    return cupo;
  }

  const sedePrincipalId = parseTorneoId(body.sedePrincipalId);
  if (!sedePrincipalId.ok) {
    return failure("El identificador de la sede no es válido.");
  }

  const sedeNombre = readText(body.sedeNombre, "El nombre de la sede", 2, 80, NAME_PATTERN);
  if (!sedeNombre.ok) {
    return sedeNombre;
  }

  const ciudad = readText(body.ciudad, "La ciudad", 2, 60, PLACE_PATTERN);
  if (!ciudad.ok) {
    return ciudad;
  }

  const cierreInscripciones = readDate(body.cierreInscripciones);
  if (!cierreInscripciones.ok) {
    return cierreInscripciones;
  }

  const descripcion = readDescription(body.descripcion);
  if (!descripcion.ok) {
    return descripcion;
  }

  return {
    ok: true,
    value: {
      nombre: nombre.value,
      deporte: deporte.value,
      estado: estado.value,
      ...cupo.value,
      sedePrincipalId: sedePrincipalId.value,
      sedeNombre: sedeNombre.value,
      ciudad: ciudad.value,
      cierreInscripciones: cierreInscripciones.value,
      descripcion: descripcion.value,
    },
  };
}

function readCupo(
  cupoEquipos: unknown,
  cupoJugadores: unknown,
): ParseResult<{ cupoEquipos: number; cupoJugadores: null } | { cupoEquipos: null; cupoJugadores: number }> {
  const equipos = readOptionalPositiveInt(cupoEquipos, "El cupo de equipos");
  if (!equipos.ok) {
    return equipos;
  }

  const jugadores = readOptionalPositiveInt(cupoJugadores, "El cupo de jugadores");
  if (!jugadores.ok) {
    return jugadores;
  }

  if (equipos.value !== null && jugadores.value === null) {
    return { ok: true, value: { cupoEquipos: equipos.value, cupoJugadores: null } };
  }

  if (jugadores.value !== null && equipos.value === null) {
    return { ok: true, value: { cupoEquipos: null, cupoJugadores: jugadores.value } };
  }

  return failure("Debe indicarse exactamente un cupo positivo y el otro debe ser nulo.");
}

function readOptionalPositiveInt(value: unknown, label: string): ParseResult<number | null> {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }

  if (typeof value !== "number" || !Number.isInteger(value)) {
    return failure(`${label} debe ser un entero positivo o nulo.`);
  }

  if (value < 1 || value > 500) {
    return failure(`${label} debe estar entre 1 y 500.`);
  }

  return { ok: true, value };
}

function readEstado(value: unknown): ParseResult<EstadoTorneo> {
  const estado = ESTADOS_TORNEO.find((item) => item === value);

  if (estado === undefined) {
    return failure("El estado del torneo no es válido.");
  }

  return { ok: true, value: estado };
}

export function withId(id: string, draft: TorneoDraft): Torneo {
  if (draft.cupoEquipos !== null) {
    return {
      id,
      nombre: draft.nombre,
      deporte: draft.deporte,
      estado: draft.estado,
      cupoEquipos: draft.cupoEquipos,
      cupoJugadores: null,
      sedePrincipalId: draft.sedePrincipalId,
      sedeNombre: draft.sedeNombre,
      ciudad: draft.ciudad,
      cierreInscripciones: draft.cierreInscripciones,
      descripcion: draft.descripcion,
    };
  }

  return {
    id,
    nombre: draft.nombre,
    deporte: draft.deporte,
    estado: draft.estado,
    cupoEquipos: null,
    cupoJugadores: draft.cupoJugadores,
    sedePrincipalId: draft.sedePrincipalId,
    sedeNombre: draft.sedeNombre,
    ciudad: draft.ciudad,
    cierreInscripciones: draft.cierreInscripciones,
    descripcion: draft.descripcion,
  };
}

function readDate(value: unknown): ParseResult<string> {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return failure("La fecha de cierre debe tener el formato AAAA-MM-DD.");
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));

  if (year < 2000 || year > 2100) {
    return failure("La fecha de cierre está fuera del rango permitido.");
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  const valid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  if (!valid) {
    return failure("La fecha de cierre no existe en el calendario.");
  }

  return { ok: true, value };
}

function readDescription(value: unknown): ParseResult<string> {
  if (typeof value !== "string") {
    return failure("La descripción es obligatoria.");
  }

  const descripcion = value.trim();

  if (descripcion.length < 10 || descripcion.length > 800) {
    return failure("La descripción debe tener entre 10 y 800 caracteres.");
  }

  if (/[\u0000-\u001F\u007F]/.test(descripcion)) {
    return failure("La descripción contiene caracteres no válidos.");
  }

  return { ok: true, value: descripcion };
}

function readText(
  value: unknown,
  label: string,
  min: number,
  max: number,
  pattern: RegExp,
): ParseResult<string> {
  if (typeof value !== "string") {
    return failure(`${label} es obligatorio.`);
  }

  const text = value.trim();

  if (text.length < min || text.length > max || !pattern.test(text)) {
    return failure(`${label} no es válido.`);
  }

  return { ok: true, value: text };
}

function unknownField(body: Record<string, unknown>, allowed: readonly string[]): boolean {
  return Object.keys(body).some((key) => !allowed.includes(key));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function failure(message: string): ParseResult<never> {
  return { ok: false, message };
}
