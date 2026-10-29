export type RegisterInput = {
  nombre: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function parseRegisterBody(body: unknown): ParseResult<RegisterInput> {
  if (!isRecord(body)) {
    return failure("El cuerpo de la petición debe ser un objeto JSON.");
  }

  if ("role" in body) {
    return failure("No se puede asignar el rol durante el registro.");
  }

  const unknownKey = Object.keys(body).find(
    (key) => key !== "nombre" && key !== "email" && key !== "password",
  );

  if (unknownKey !== undefined) {
    return failure("El cuerpo contiene campos no permitidos.");
  }

  const nombre = readNombre(body.nombre);
  if (!nombre.ok) {
    return nombre;
  }

  const email = readEmail(body.email);
  if (!email.ok) {
    return email;
  }

  const password = readPassword(body.password);
  if (!password.ok) {
    return password;
  }

  return {
    ok: true,
    value: {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
    },
  };
}

export function parseLoginBody(body: unknown): ParseResult<LoginInput> {
  if (!isRecord(body)) {
    return failure("El cuerpo de la petición debe ser un objeto JSON.");
  }

  const unknownKey = Object.keys(body).find((key) => key !== "email" && key !== "password");

  if (unknownKey !== undefined) {
    return failure("El cuerpo contiene campos no permitidos.");
  }

  const email = readEmail(body.email);
  if (!email.ok) {
    return email;
  }

  const password = readPassword(body.password);
  if (!password.ok) {
    return password;
  }

  return {
    ok: true,
    value: {
      email: email.value,
      password: password.value,
    },
  };
}

function readNombre(value: unknown): ParseResult<string> {
  if (typeof value !== "string") {
    return failure("El nombre es obligatorio.");
  }

  const nombre = value.trim();

  if (nombre.length < 2 || nombre.length > 80) {
    return failure("El nombre debe tener entre 2 y 80 caracteres.");
  }

  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(nombre)) {
    return failure("El nombre solo puede contener letras, espacios, apóstrofos, puntos y guiones.");
  }

  return { ok: true, value: nombre };
}

function readEmail(value: unknown): ParseResult<string> {
  if (typeof value !== "string") {
    return failure("El correo es obligatorio.");
  }

  const email = normalizeEmail(value);

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return failure("El correo no tiene un formato válido.");
  }

  return { ok: true, value: email };
}

function readPassword(value: unknown): ParseResult<string> {
  if (typeof value !== "string" || value.length === 0) {
    return failure("La contraseña es obligatoria.");
  }

  if (value.length < 8 || value.length > 72) {
    return failure("La contraseña debe tener entre 8 y 72 caracteres.");
  }

  return { ok: true, value };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function failure(message: string): ParseResult<never> {
  return { ok: false, message };
}
