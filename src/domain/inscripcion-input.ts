import { DISPONIBILIDADES, type Disponibilidad } from "./disponibilidad";
import { parseTorneoId } from "./torneo-input";

export type CreateInscripcionInput = {
  torneoId: string;
  disponibilidad: Disponibilidad;
  mensaje: string;
};

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

const ALLOWED_FIELDS = ["torneoId", "disponibilidad", "mensaje"] as const;
const IDENTITY_FIELDS = ["userId", "email", "nombre", "role", "id", "password"] as const;

export function parseCreateInscripcionBody(body: unknown): ParseResult<CreateInscripcionInput> {
  if (!isRecord(body)) {
    return failure("El cuerpo de la petición debe ser un objeto JSON.");
  }

  if (IDENTITY_FIELDS.some((field) => field in body)) {
    return failure("No se puede indicar la identidad en el cuerpo de la petición.");
  }

  if (Object.keys(body).some((key) => !ALLOWED_FIELDS.some((field) => field === key))) {
    return failure("El cuerpo contiene campos no permitidos.");
  }

  const torneoId = parseTorneoId(body.torneoId);
  if (!torneoId.ok) {
    return torneoId;
  }

  const disponibilidad = readDisponibilidad(body.disponibilidad);
  if (!disponibilidad.ok) {
    return disponibilidad;
  }

  const mensaje = readMensaje(body.mensaje);
  if (!mensaje.ok) {
    return mensaje;
  }

  return {
    ok: true,
    value: {
      torneoId: torneoId.value,
      disponibilidad: disponibilidad.value,
      mensaje: mensaje.value,
    },
  };
}

function readDisponibilidad(value: unknown): ParseResult<Disponibilidad> {
  const disponibilidad = DISPONIBILIDADES.find((item) => item === value);

  if (disponibilidad === undefined) {
    return failure("La disponibilidad no es válida.");
  }

  return { ok: true, value: disponibilidad };
}

function readMensaje(value: unknown): ParseResult<string> {
  if (typeof value !== "string") {
    return failure("El mensaje es obligatorio.");
  }

  const mensaje = value.trim();

  if (mensaje.length < 10) {
    return failure("El mensaje debe tener al menos 10 caracteres.");
  }

  if (mensaje.length > 1000) {
    return failure("El mensaje no puede superar 1000 caracteres.");
  }

  if (/[\u0000-\u001F\u007F]/.test(mensaje)) {
    return failure("El mensaje contiene caracteres no válidos.");
  }

  return { ok: true, value: mensaje };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function failure(message: string): ParseResult<never> {
  return { ok: false, message };
}
